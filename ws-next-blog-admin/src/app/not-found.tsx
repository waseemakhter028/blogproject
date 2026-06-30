import { Box, Button, Container, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconMoodSad } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 – Page Not Found | WS Blog Admin",
};

export default function NotFound() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container size={540} ta="center">
        <Stack align="center" gap="lg">
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="WS Blog Admin"
            style={{ height: 125, objectFit: "contain" }}
          />

          {/* 404 number */}
          <Text
            style={{
              fontSize: "clamp(7rem, 20vw, 12rem)",
              fontWeight: 900,
              lineHeight: 1,
              background:
                "linear-gradient(135deg, #4c6ef5 0%, #228be6 50%, #15aabf 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            404
          </Text>

          <IconMoodSad
            size={48}
            stroke={1.5}
            style={{ color: "#4c6ef5", marginTop: -16 }}
          />

          <Stack gap={8} align="center">
            <Title
              order={2}
              style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem" }}
            >
              Page not found
            </Title>
            <Text size="md" style={{ color: "#a0aec0", maxWidth: 360 }}>
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved. Let&apos;s get you back on track.
            </Text>
          </Stack>

          {/* Accent divider */}
          <Box
            style={{
              width: 60,
              height: 3,
              borderRadius: 999,
              background: "linear-gradient(90deg, #4c6ef5, #15aabf)",
            }}
          />

          <Button
            component="a"
            href="/adminpanel/dashboard"
            size="md"
            radius="md"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 135 }}
            leftSection={<IconArrowLeft size={18} />}
            style={{ fontWeight: 700, paddingInline: 28 }}
          >
            Go back to Dashboard
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
