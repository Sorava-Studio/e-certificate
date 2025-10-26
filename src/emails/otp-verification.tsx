import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type OTPVerificationEmailProps = {
  code: string;
  email: string;
};

export function OTPVerificationEmail({
  code,
  email,
}: OTPVerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre code de vérification E-Certificate</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Vérification de votre compte</Heading>
          <Text style={text}>Bonjour,</Text>
          <Text style={text}>
            Vous avez demandé un code de vérification pour votre compte{" "}
            <strong>{email}</strong>.
          </Text>
          <Section style={codeContainer}>
            <Text style={codeText}>{code}</Text>
          </Section>
          <Text style={text}>
            Ce code est valide pendant <strong>10 minutes</strong>.
          </Text>
          <Text style={text}>
            Si vous n&apos;avez pas demandé ce code, vous pouvez ignorer cet
            email en toute sécurité.
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

OTPVerificationEmail.PreviewProps = {
  code: "123456",
  email: "user@example.com",
} as OTPVerificationEmailProps;

export default OTPVerificationEmail;

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

const codeContainer = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  margin: "32px auto",
  padding: "24px",
  textAlign: "center" as const,
  width: "fit-content",
};

const codeText = {
  color: "#2563eb",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
  fontFamily: "monospace",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 0 0",
  padding: "0 40px",
};
