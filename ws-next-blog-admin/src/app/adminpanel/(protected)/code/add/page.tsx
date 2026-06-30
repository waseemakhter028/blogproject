"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Title,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  Breadcrumbs,
  Anchor,
  ThemeIcon,
  Stack,
  Text,
  Image,
  FileInput,
} from "@mantine/core";
import { useForm, schemaResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCode, IconCheck, IconUpload } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  subCategoryId: z.string().min(1, "Please select a sub category"),
  language: z.string().min(1, "Language is required").max(50),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Please select a status"),
});

interface SelectOption {
  value: string;
  label: string;
}

export default function CodeAddPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [subCategories, setSubCategories] = useState<SelectOption[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLButtonElement>(null);

  const form = useForm({
    validate: schemaResolver(schema),
    initialValues: {
      categoryId: "",
      subCategoryId: "",
      language: "",
      title: "",
      description: "",
      status: "1",
    },
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

  const handleCategoryChange = async (val: string | null) => {
    form.setFieldValue("categoryId", val ?? "");
    form.setFieldValue("subCategoryId", "");
    setSubCategories([]);
    if (!val) return;
    setSubLoading(true);
    const res = await fetch(
      `/api/admin/subcategories?categoryId=${val}&limit=200`,
    );
    const json = await res.json();
    setSubCategories(
      (json.data as { id: number; name: string }[]).map((s) => ({
        value: String(s.id),
        label: s.name,
      })),
    );
    setSubLoading(false);
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setImageError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!imagePreview) {
      setImageError("Image is required");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/admin/codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subCategoryId: Number(values.subCategoryId),
        title: values.title,
        description: values.description,
        language: values.language,
        status: Number(values.status),
        image: imagePreview,
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
        message: "Code added successfully.",
      });
      router.push("/adminpanel/code/list");
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
          <ThemeIcon size={36} radius="md" color="violet">
            <IconCode size={20} />
          </ThemeIcon>
          <Box>
            <Title order={4} fw={700}>
              Codes
            </Title>
            <Breadcrumbs separator="›" fz="xs" c="dimmed">
              <Anchor href="/adminpanel/dashboard" fz="xs">
                Admin
              </Anchor>
              <Anchor href="/adminpanel/code/list" fz="xs">
                Code List
              </Anchor>
              <Text fz="xs">Add Code</Text>
            </Breadcrumbs>
          </Box>
        </Group>
      </Paper>

      {/* Form */}
      <Paper radius="md" shadow="xs" p="lg" style={{ background: "#fff" }}>
        <Title order={5} c="violet" fw={700} mb="md">
          Add Code Details
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md" maw={600}>
            {/* Image Upload */}
            <Box>
              <FileInput
                label="Image"
                placeholder="Click to upload image"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                leftSection={<IconUpload size={16} />}
                withAsterisk
                error={imageError}
                onChange={handleImageChange}
                clearable
                ref={fileInputRef}
              />
              {imagePreview && (
                <Box mt="xs">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    w={160}
                    h={100}
                    radius="sm"
                    fit="cover"
                  />
                </Box>
              )}
            </Box>

            {/* Category → Sub Category cascade */}
            <Select
              label="Category"
              placeholder="Select category"
              data={categories}
              searchable
              withAsterisk
              value={form.values.categoryId || null}
              onChange={handleCategoryChange}
              error={form.errors.categoryId as string}
            />
            <Select
              label="Sub Category"
              placeholder={(() => {
                if (!form.values.categoryId) return "Select a category first";
                if (subLoading) return "Loading\u2026";
                return "Select sub category";
              })()}
              data={subCategories}
              searchable
              disabled={!form.values.categoryId || subLoading}
              withAsterisk
              {...form.getInputProps("subCategoryId")}
            />

            <TextInput
              label="Language"
              placeholder="e.g. JavaScript, Python, PHP"
              withAsterisk
              {...form.getInputProps("language")}
            />
            <Textarea
              label="Title"
              placeholder="Enter code title / snippet heading"
              withAsterisk
              autosize
              minRows={2}
              maxRows={4}
              {...form.getInputProps("title")}
            />
            <Textarea
              label="Description / Code"
              placeholder="Paste or write the code / description here"
              withAsterisk
              autosize
              minRows={6}
              maxRows={20}
              styles={{ input: { fontFamily: "monospace", fontSize: "13px" } }}
              {...form.getInputProps("description")}
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
                gradient={{ from: "violet", to: "indigo", deg: 135 }}
                radius="md"
                loading={submitting}
              >
                Save Code
              </Button>
              <Button
                variant="default"
                radius="md"
                onClick={() => router.push("/adminpanel/code/list")}
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
