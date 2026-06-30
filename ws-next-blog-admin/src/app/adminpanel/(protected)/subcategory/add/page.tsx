"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Breadcrumbs,
  Anchor,
  ThemeIcon,
  Stack,
  Text,
} from "@mantine/core";
import { useForm, schemaResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconFolderOpen, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(40, "Name must be at most 40 characters"),
  status: z.string().min(1, "Please select a status"),
});

interface CategoryOption {
  value: string;
  label: string;
}

export default function SubCategoryAddPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    validate: schemaResolver(schema),
    initialValues: { categoryId: "", name: "", status: "1" },
  });

  useEffect(() => {
    fetch("/api/admin/categories?page=1&limit=200")
      .then((r) => r.json())
      .then((json) =>
        setCategories(
          (json.data as { id: number; name: string }[]).map((c) => ({
            value: String(c.id),
            label: c.name,
          })),
        ),
      );
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    const res = await fetch("/api/admin/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: Number(values.categoryId),
        name: values.name,
        status: Number(values.status),
      }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (res.status === 422) {
      const errs = data.errors as Record<string, string[]>;
      Object.entries(errs).forEach(([field, msgs]) => {
        form.setFieldError(field, msgs[0]);
      });
      return;
    }

    if (res.ok) {
      notifications.show({
        color: "green",
        icon: <IconCheck size={16} />,
        message: "Sub Category added successfully.",
      });
      router.push("/adminpanel/subcategory/list");
    }
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
        <Group>
          <ThemeIcon size={36} radius="md" color="teal">
            <IconFolderOpen size={20} />
          </ThemeIcon>
          <Box>
            <Title order={4} fw={700}>
              Sub Category
            </Title>
            <Breadcrumbs separator="›" fz="xs" c="dimmed">
              <Anchor href="/adminpanel/dashboard" fz="xs">
                Admin
              </Anchor>
              <Anchor href="/adminpanel/subcategory/list" fz="xs">
                Sub Category List
              </Anchor>
              <Text fz="xs">Add Sub Category</Text>
            </Breadcrumbs>
          </Box>
        </Group>
      </Paper>

      {/* Form */}
      <Paper radius="md" shadow="xs" p="lg" style={{ background: "#fff" }}>
        <Title order={5} c="teal" fw={700} mb="md">
          Add Sub Category
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md" maw={500}>
            <Select
              label="Category"
              placeholder="Select category"
              data={categories}
              searchable
              withAsterisk
              {...form.getInputProps("categoryId")}
            />
            <TextInput
              label="Sub Category Name"
              placeholder="Enter sub category name"
              withAsterisk
              {...form.getInputProps("name")}
            />
            <Select
              label="Status"
              placeholder="Select status"
              data={[
                { value: "1", label: "Active" },
                { value: "0", label: "Inactive" },
              ]}
              withAsterisk
              {...form.getInputProps("status")}
            />

            <Group mt="xs">
              <Button
                type="submit"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 135 }}
                radius="md"
                loading={submitting}
              >
                Save Sub Category
              </Button>
              <Button
                variant="default"
                radius="md"
                onClick={() => router.push("/adminpanel/subcategory/list")}
              >
                Cancel
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
