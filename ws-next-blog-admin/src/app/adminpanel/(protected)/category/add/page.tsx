"use client";

import {
  Box,
  Paper,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Stack,
  Breadcrumbs,
  Anchor,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import { useForm, schemaResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconTag,
  IconArrowLeft,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(40, "Max 40 characters"),
  status: z.string().min(1, "Please select a status"),
});

type FormValues = z.infer<typeof schema>;

export default function CategoryAddPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    validate: schemaResolver(schema),
    initialValues: { name: "", status: "" },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setServerError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        status: Number(values.status),
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.status === 422) {
      if (data.errors?.name) form.setFieldError("name", data.errors.name[0]);
      return;
    }
    if (!res.ok) {
      setServerError("Something went wrong. Please try again.");
      return;
    }

    notifications.show({
      color: "green",
      icon: <IconCheck size={16} />,
      message: "Category added successfully!",
    });
    router.push("/adminpanel/category/list");
  };

  return (
    <Box p="lg" style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Paper
        radius="md"
        p="md"
        mb="lg"
        shadow="xs"
        style={{ background: "#fff" }}
      >
        <Group justify="space-between">
          <Group>
            <ThemeIcon size={36} radius="md" color="blue">
              <IconTag size={20} />
            </ThemeIcon>
            <Box>
              <Title order={4} fw={700}>
                Add Category
              </Title>
              <Breadcrumbs separator="›" fz="xs" c="dimmed">
                <Anchor href="/adminpanel/dashboard" fz="xs">
                  Admin
                </Anchor>
                <Anchor href="/adminpanel/category/list" fz="xs">
                  Category List
                </Anchor>
                <span style={{ fontSize: "0.75rem" }}>Add</span>
              </Breadcrumbs>
            </Box>
          </Group>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            variant="default"
            radius="md"
            onClick={() => router.push("/adminpanel/category/list")}
          >
            Back
          </Button>
        </Group>
      </Paper>

      {/* Form */}
      <Paper
        radius="md"
        shadow="xs"
        p="xl"
        style={{ background: "#fff" }}
        maw={600}
      >
        <Title order={5} fw={700} mb="lg">
          Add Category Details
        </Title>

        {serverError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            mb="md"
            radius="md"
          >
            {serverError}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="Enter category name"
              required
              radius="md"
              maxLength={40}
              styles={{ input: { background: "#fff" } }}
              {...form.getInputProps("name")}
            />

            <Select
              label="Status"
              placeholder="Select Status"
              required
              radius="md"
              data={[
                { value: "1", label: "Active" },
                { value: "0", label: "Inactive" },
              ]}
              styles={{ input: { background: "#fff" } }}
              {...form.getInputProps("status")}
            />

            <Group mt="sm">
              <Button
                type="submit"
                loading={loading}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 135 }}
                radius="md"
                px={32}
              >
                Save Category
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
