"use client";

import { use, useEffect, useState } from "react";
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
  Skeleton,
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

export default function SubCategoryEditPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    validate: schemaResolver(schema),
    initialValues: { categoryId: "", name: "", status: "1" },
  });

  useEffect(() => {
    // Load categories and subcategory data in parallel
    Promise.all([
      fetch("/api/admin/categories?page=1&limit=200").then((r) => r.json()),
      fetch(`/api/admin/subcategories/${id}`).then((r) => r.json()),
    ]).then(([catJson, subJson]) => {
      setCategories(
        (catJson.data as { id: number; name: string }[]).map((c) => ({
          value: String(c.id),
          label: c.name,
        })),
      );
      if (subJson.data) {
        form.setValues({
          categoryId: String(subJson.data.categoryId),
          name: subJson.data.name,
          status: String(subJson.data.status),
        });
      }
      setLoadingData(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    const res = await fetch(`/api/admin/subcategories/${id}`, {
      method: "PUT",
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
        message: "Sub Category updated successfully.",
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
              <Text fz="xs">Edit Sub Category</Text>
            </Breadcrumbs>
          </Box>
        </Group>
      </Paper>

      {/* Form */}
      <Paper radius="md" shadow="xs" p="lg" style={{ background: "#fff" }}>
        <Title order={5} c="teal" fw={700} mb="md">
          Edit Sub Category
        </Title>

        {loadingData ? (
          <Stack gap="md" maw={500}>
            <Skeleton height={36} radius="sm" />
            <Skeleton height={36} radius="sm" />
            <Skeleton height={36} radius="sm" />
          </Stack>
        ) : (
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
                  Update Sub Category
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
        )}
      </Paper>
    </Box>
  );
}
