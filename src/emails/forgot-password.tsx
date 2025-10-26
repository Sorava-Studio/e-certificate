import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ForgotPasswordEmailProps = {
  resetLink: string;
  email: string;
};

export function ForgotPasswordEmail({
  resetLink,
  email,
}: ForgotPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisation de votre mot de passe E-Certificate</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Réinitialisation de mot de passe</Heading>
          <Text style={text}>Bonjour,</Text>
          <Text style={text}>
            Vous avez demandé la réinitialisation du mot de passe pour votre
            compte <strong>{email}</strong>.
          </Text>
          <Text style={text}>
            Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
          </Text>
          <Section style={buttonContainer}>
            <Link href={resetLink} style={button}>
              Réinitialiser mon mot de passe
            </Link>
          </Section>
          <Text style={text}>
            Ce lien est valide pendant <strong>1 heure</strong>.
          </Text>
          <Text style={text}>
            Si vous n&apos;avez pas demandé cette réinitialisation, vous pouvez
            ignorer cet email en toute sécurité. Votre mot de passe actuel reste
            inchangé.
          </Text>
          <Text style={footer}>
            Cordialement,
            <br />
            L&apos;équipe E-Certificate
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

ForgotPasswordEmail.PreviewProps = {
  resetLink: "https://example.com/reset-password?token=abc123",
  email: "user@example.com",
} as ForgotPasswordEmailProps;

export default ForgotPasswordEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "0 40px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "4px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 0 0",
  padding: "0 40px",
};
