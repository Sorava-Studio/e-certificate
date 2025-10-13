"use server";

// ============================================
// 📦 ITEM SERVER ACTIONS
// ============================================
// Server actions for luxury item management
// ============================================

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { item } from "@/db/schema/tables/items";
import { requireAuth } from "@/lib/session";
import type {
  CreateItemData,
  SaveDraftItemData,
  UpdateItemData,
} from "@/validations/item";
import {
  createItemSchema,
  saveDraftItemSchema,
  updateItemSchema,
} from "@/validations/item";

// ============================================
// TYPE DEFINITIONS
// ============================================

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================
// CHECK FOR DUPLICATE SERIAL NUMBER
// ============================================

export async function checkDuplicateSerialNumber(
  serialNumber: string
): Promise<ActionResult<{ exists: boolean }>> {
  try {
    await requireAuth();

    if (!serialNumber || serialNumber.trim() === "") {
      return { success: false, error: "Serial number is required" };
    }

    const existingItem = await db.query.item.findFirst({
      where: eq(item.serialNumber, serialNumber.trim()),
    });

    return {
      success: true,
      data: { exists: !!existingItem },
    };
  } catch {
    return { success: false, error: "Failed to check serial number" };
  }
}

// ============================================
// CREATE NEW ITEM
// ============================================

export async function createItem(
  data: CreateItemData
): Promise<ActionResult<{ id: string }>> {
  try {
    const { user } = await requireAuth();

    // Validate the data
    const validatedData = createItemSchema.parse(data);

    // Check for duplicate serial number
    const duplicate = await checkDuplicateSerialNumber(
      validatedData.serialNumber
    );
    if (duplicate.success && duplicate.data.exists) {
      return {
        success: false,
        error:
          "An item with this serial number already exists. Please check and try again.",
      };
    }

    // Create the item
    const itemId = nanoid();
    await db.insert(item).values({
      id: itemId,
      userId: user.id,
      ...validatedData,
      status: "pending_verification",
      purchaseDate: validatedData.purchaseDate
        ? new Date(validatedData.purchaseDate).toISOString().split("T")[0]
        : null,
      purchasePrice: validatedData.purchasePrice?.toString() ?? null,
    });

    revalidatePath("/dashboard/certificates");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id: itemId },
    };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }

    return {
      success: false,
      error: "Failed to create item. Please try again.",
    };
  }
}

// ============================================
// SAVE AS DRAFT
// ============================================

export async function saveDraft(
  data: SaveDraftItemData
): Promise<ActionResult<{ id: string }>> {
  try {
    const { user } = await requireAuth();

    // Validate draft data
    const validatedData = saveDraftItemSchema.parse({
      ...data,
      status: "draft",
    });

    // Check for duplicate serial number if provided
    if (validatedData.serialNumber) {
      const duplicate = await checkDuplicateSerialNumber(
        validatedData.serialNumber
      );
      if (duplicate.success && duplicate.data.exists) {
        return {
          success: false,
          error: "An item with this serial number already exists.",
        };
      }
    }

    // Create draft item
    const itemId = nanoid();
    await db.insert(item).values({
      id: itemId,
      userId: user.id,
      type: validatedData.type || "watch",
      brand: validatedData.brand || "",
      model: validatedData.model || "",
      referenceNumber: validatedData.referenceNumber || "",
      serialNumber: validatedData.serialNumber || "",
      yearManufactured:
        validatedData.yearManufactured || new Date().getFullYear(),
      purchaseDate: validatedData.purchaseDate
        ? new Date(validatedData.purchaseDate).toISOString().split("T")[0]
        : null,
      purchasePrice: validatedData.purchasePrice?.toString() ?? null,
      status: "draft",
    });

    revalidatePath("/dashboard/certificates");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id: itemId },
    };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }

    return {
      success: false,
      error: "Failed to save draft. Please try again.",
    };
  }
}

// ============================================
// UPDATE ITEM
// ============================================

export async function updateItem(
  id: string,
  data: UpdateItemData
): Promise<ActionResult> {
  try {
    const { user } = await requireAuth();

    // Validate the data
    const validatedData = updateItemSchema.parse(data);

    // Check if item exists and belongs to user
    const existingItem = await db.query.item.findFirst({
      where: eq(item.id, id),
    });

    if (!existingItem) {
      return { success: false, error: "Item not found" };
    }

    if (existingItem.userId !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Check for duplicate serial number if changed
    if (
      validatedData.serialNumber &&
      validatedData.serialNumber !== existingItem.serialNumber
    ) {
      const duplicate = await checkDuplicateSerialNumber(
        validatedData.serialNumber
      );
      if (duplicate.success && duplicate.data.exists) {
        return {
          success: false,
          error: "An item with this serial number already exists.",
        };
      }
    }

    // Update the item
    await db
      .update(item)
      .set({
        ...validatedData,
        purchaseDate: validatedData.purchaseDate
          ? new Date(validatedData.purchaseDate).toISOString().split("T")[0]
          : undefined,
        purchasePrice: validatedData.purchasePrice?.toString(),
        updatedAt: new Date(),
      })
      .where(eq(item.id, id));

    revalidatePath("/dashboard/certificates");
    revalidatePath(`/dashboard/certificates/${id}`);

    return { success: true, data: undefined };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }

    return {
      success: false,
      error: "Failed to update item. Please try again.",
    };
  }
}

// ============================================
// GET USER ITEMS
// ============================================

export async function getUserItems() {
  try {
    const { user } = await requireAuth();

    const items = await db.query.item.findMany({
      where: eq(item.userId, user.id),
      orderBy: (itemTable, { desc }) => [desc(itemTable.createdAt)],
    });

    return {
      success: true,
      data: items,
    };
  } catch {
    return { success: false, error: "Failed to fetch items" };
  }
}

// ============================================
// GET ITEM BY ID
// ============================================

export async function getItemById(id: string) {
  try {
    const { user } = await requireAuth();

    const foundItem = await db.query.item.findFirst({
      where: eq(item.id, id),
    });

    if (!foundItem) {
      return { success: false, error: "Item not found" };
    }

    if (foundItem.userId !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    return {
      success: true,
      data: foundItem,
    };
  } catch {
    return { success: false, error: "Failed to fetch item" };
  }
}
