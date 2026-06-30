"use client";

import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Stack,
  Box,
  Center,
  Divider,
  Alert,
} from "@mantine/core";
import { useForm, schemaResolver } from "@mantine/form";
import { IconLock, IconMail, IconAlertCircle } from "@tabler/icons-react";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .check(z.email("Please enter a valid email address")),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    validate: schemaResolver(loginSchema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.status === "200") {
        router.push("/adminpanel/dashboard");
      } else {
        setError(data.msg ?? "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <Container size={440} w="100%">
        <Center mb="xl">
          <Stack align="center" gap="xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="WS Blog Admin"
              style={{ height: 125, objectFit: "contain" }}
            />
            <Text c="dimmed" size="sm" ta="center" style={{ color: "#a0aec0" }}>
              Sign in to access the admin panel
            </Text>
          </Stack>
        </Center>

        <Paper
          radius="lg"
          p="xl"
          withBorder
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          <Title order={3} mb={4} style={{ color: "#fff" }}>
            Welcome back
          </Title>
          <Text size="sm" mb="lg" style={{ color: "#a0aec0" }}>
            Enter your credentials to continue
          </Text>

          <Divider mb="lg" style={{ borderColor: "rgba(255,255,255,0.1)" }} />

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              mb="md"
              radius="md"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
            <Stack gap="md">
              <TextInput
                label="Email Address"
                placeholder="admin@example.com"
                leftSection={<IconMail size={16} />}
                size="md"
                radius="md"
                styles={{
                  label: { color: "#cbd5e0", marginBottom: 6, fontWeight: 500 },
                  input: {
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    "::placeholder": { color: "#718096" },
                  },
                }}
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                leftSection={<IconLock size={16} />}
                size="md"
                radius="md"
                styles={{
                  label: { color: "#cbd5e0", marginBottom: 6, fontWeight: 500 },
                  input: {
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                  },
                }}
                {...form.getInputProps("password")}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                loading={loading}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 135 }}
                mt="sm"
                style={{ fontWeight: 700, fontSize: "0.95rem" }}
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </Paper>

        <Text ta="center" mt="md" size="xs" style={{ color: "#718096" }}>
          © {new Date().getFullYear()} WS Blog. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
