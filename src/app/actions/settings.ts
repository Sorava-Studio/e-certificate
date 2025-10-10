"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { user } from "@/db/schema/tables/auth";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(MIN_NAME_LENGTH, "Name must be at least 2 characters")
    .max(MAX_NAME_LENGTH),
  email: z.string().email("Invalid email address"),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ============================================
// PROFILE ACTIONS
// ============================================

type UpdateProfileResult = {
  success: boolean;
  message: string;
};

export async function updateProfile(data: {
  name: string;
  email: string;
}): Promise<UpdateProfileResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to update your profile",
      };
    }

    // Validate input
    const validated = updateProfileSchema.parse(data);

    // Check if email is already taken by another user
    if (validated.email !== currentUser.email) {
      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, validated.email),
      });

      if (existingUser && existingUser.id !== currentUser.id) {
        return {
          success: false,
          message: "Email is already in use",
        };
      }
    }

    // Update user in database
    await db
      .update(user)
      .set({
        name: validated.name,
        email: validated.email,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser.id));

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      };
    }

    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}

export async function updateProfileImage(
  imageUrl: string
): Promise<UpdateProfileResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to update your profile picture",
      };
    }

    await db
      .update(user)
      .set({
        image: imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser.id));

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Profile picture updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update profile picture. Please try again.",
    };
  }
}

export async function removeProfileImage(): Promise<UpdateProfileResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to remove your profile picture",
      };
    }

    await db
      .update(user)
      .set({
        image: null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser.id));

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Profile picture removed successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to remove profile picture. Please try again.",
    };
  }
}

// ============================================
// PASSWORD ACTIONS
// ============================================

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<UpdateProfileResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to change your password",
      };
    }

    // Validate input
    const validated = changePasswordSchema.parse(data);

    // Get the session from headers
    const headersList = await headers();

    try {
      // Use Better Auth's changePassword method
      await auth.api.changePassword({
        body: {
          currentPassword: validated.currentPassword,
          newPassword: validated.newPassword,
          revokeOtherSessions: false, // Keep other sessions active
        },
        headers: headersList,
      });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (authError) {
      // Handle Better Auth specific errors
      const errorMessage =
        authError instanceof Error ? authError.message : "Unknown error";

      if (errorMessage.includes("Invalid password")) {
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }

      if (errorMessage.includes("not found")) {
        return {
          success: false,
          message: "Session not found. Please log in again.",
        };
      }

      return {
        success: false,
        message: "Failed to change password. Please try again.",
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      };
    }

    return {
      success: false,
      message: "Failed to change password. Please try again.",
    };
  }
}

// ============================================
// ACCOUNT DELETION
// ============================================

export async function deleteAccount(
  confirmationText: string
): Promise<UpdateProfileResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to delete your account",
      };
    }

    // Verify confirmation text
    if (confirmationText !== "DELETE") {
      return {
        success: false,
        message: 'Please type "DELETE" to confirm account deletion',
      };
    }

    // Delete user and all related data (cascade will handle sessions, etc.)
    await db.delete(user).where(eq(user.id, currentUser.id));

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to delete account. Please try again.",
    };
  }
}
