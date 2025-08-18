import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  customerName: string;
  tenantName: string;
  tenantLogo: string;
}

const baseUrl = process.env.BASE_URL || "https://senku-loyalty.web.app";

export const WelcomeEmail = ({
  customerName,
  tenantName,
  tenantLogo,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>¡Bienvenido a {tenantName}! Tu aventura de lealtad comienza ahora.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={tenantLogo}
            width="80"
            height="80"
            alt={`${tenantName} Logo`}
            style={logo}
            data-ai-hint="logo"
          />
        </Section>
        <Heading style={h1}>¡Bienvenido a bordo, {customerName}!</Heading>
        <Text style={text}>
          Gracias por unirte al programa de lealtad de <strong>{tenantName}</strong>. Estamos emocionados de tenerte y no podemos esperar para recompensarte.
        </Text>
        <Text style={text}>
          A partir de ahora, acumularás puntos con cada compra que podrás canjear por increíbles recompensas.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={`${baseUrl}/customer/find`}>
            Ver mis puntos y recompensas
          </Button>
        </Section>
        <Text style={text}>
          Si tienes alguna pregunta, no dudes en responder a este correo.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Enviado por {tenantName} a través de la plataforma Senku Lealtad.
        </Text>
        <Link href={baseUrl} style={reportLink}>
          Senku Lealtad
        </Link>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const logoContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 0",
};

const logo = {
  borderRadius: "50%",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#6366f1", // primary color
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const reportLink = {
  color: "#8898aa",
  textDecoration: "underline",
};
