"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Title,
  Group,
  Button,
  Table,
  Badge,
  ActionIcon,
  Text,
  Skeleton,
  Breadcrumbs,
  Anchor,
  ThemeIcon,
  Pagination,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import {
  IconFolderOpen,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface SubCategory {
  id: number;
  name: string;
  status: number;
  categoryId: number;
  createdAt: string;
  category: { id: number; name: string };
  _count: { codes: number };
}

const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

function SortTh({
  col,
  label,
  sortBy,
  sortDir,
  onSort,
  width,
}: Readonly<{
  col: string;
  label: string;
  sortBy: string;
  sortDir: string;
  onSort: (c: string) => void;
  width?: number;
}>) {
  const active = sortBy === col;
  return (
    <Table.Th
      w={width}
      style={{ cursor: "pointer", userSelect: "none" }}
      onClick={() => onSort(col)}
    >
      <Group gap={4} wrap="nowrap">
        {label}
        {active ? (
          sortDir === "asc" ? (
            <IconChevronUp size={12} />
          ) : (
            <IconChevronDown size={12} />
          )
        ) : (
          <IconSelector size={12} style={{ opacity: 0.4 }} />
        )}
      </Group>
    </Table.Th>
  );
}

const formatDate = (dt: string) => {
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function SubCategoryListPage() {
  const router = useRouter();
  const [data, setData] = useState<SubCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const limit = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortDir,
      ...(debouncedSearch && { search: debouncedSearch }),
    });
    const res = await fetch(`/api/admin/subcategories?${params}`);
    const json = await res.json();
    setData(json.data);
    setTotal(json.total);
    setLoading(false);
  }, [page, debouncedSearch, sortBy, sortDir]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleSort = (col: string) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("asc");
    }
    setPage(1);
  };

  const toggleStatus = async (id: number) => {
    setTogglingId(id);
    const res = await fetch(`/api/admin/subcategories/${id}`, {
      method: "PATCH",
    });
    const json = await res.json();
    setTogglingId(null);
    if (res.ok) {
      setData((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: json.data.status } : c)),
      );
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    open();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/subcategories/${deleteId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    setDeleting(false);
    close();

    if (res.status === 409) {
      notifications.show({
        color: "red",
        icon: <IconAlertCircle size={16} />,
        title: "Cannot Delete",
        message: json.msg,
        autoClose: 6000,
      });
      return;
    }

    if (res.ok) {
      notifications.show({
        color: "green",
        icon: <IconCheck size={16} />,
        message: "Sub category deleted successfully.",
      });
      fetchData();
    }
  };

  const totalPages = Math.ceil(total / limit);

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
                <Text fz="xs">Sub Category List</Text>
              </Breadcrumbs>
            </Box>
          </Group>
          <Button
            leftSection={<IconPlus size={16} />}
            variant="gradient"
            gradient={{ from: "teal", to: "cyan", deg: 135 }}
            radius="md"
            onClick={() => router.push("/adminpanel/subcategory/add")}
          >
            Add Sub Category
          </Button>
        </Group>
      </Paper>

      {/* Table */}
      <Paper radius="md" shadow="xs" p="lg" style={{ background: "#fff" }}>
        <Title order={5} c="teal" fw={700} mb="md">
          Sub Category List
        </Title>

        <TextInput
          placeholder="Search by name…"
          leftSection={<IconSearch size={15} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          mb="md"
          radius="md"
          style={{ maxWidth: 320 }}
        />

        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          stripedColor="#f8f9fa"
          highlightOnHoverColor="#e9ecef"
          styles={{
            thead: { background: "#2c3e50" },
            th: { color: "#ffffff", fontWeight: 600 },
            tbody: { background: "#ffffff" },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={70}>S.No</Table.Th>
              <SortTh
                col="name"
                label="Name"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <SortTh
                col="categoryName"
                label="Category"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
              <SortTh
                col="codesCount"
                label="Codes"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
                width={90}
              />
              <SortTh
                col="status"
                label="Status"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
                width={110}
              />
              <Table.Th w={120}>Action</Table.Th>
              <SortTh
                col="createdAt"
                label="Created On"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading
              ? SKELETON_ROWS.map((k) => (
                  <Table.Tr key={k}>
                    {["c1", "c2", "c3", "c4", "c5", "c6", "c7"].map((c) => (
                      <Table.Td key={c}>
                        <Skeleton height={16} radius="sm" />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              : data.map((row, idx) => (
                  <Table.Tr key={row.id}>
                    <Table.Td>{(page - 1) * limit + idx + 1}</Table.Td>
                    <Table.Td fw={500}>{row.name}</Table.Td>
                    <Table.Td c="dimmed" fz="sm">
                      {row.category?.name ?? "-"}
                    </Table.Td>
                    <Table.Td ta="center" fz="sm" fw={600} c="blue">
                      {row._count?.codes ?? 0}
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={row.status === 1 ? "green" : "red"}
                        variant="light"
                        radius="sm"
                        style={{
                          cursor: togglingId === row.id ? "wait" : "pointer",
                        }}
                        leftSection={
                          togglingId === row.id ? (
                            <IconRefresh
                              size={10}
                              style={{
                                animation: "spin 1s linear infinite",
                              }}
                            />
                          ) : null
                        }
                        onClick={() =>
                          togglingId === null && toggleStatus(row.id)
                        }
                      >
                        {row.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6}>
                        <ActionIcon
                          color="blue"
                          variant="light"
                          radius="md"
                          title="Edit"
                          onClick={() =>
                            router.push(
                              `/adminpanel/subcategory/edit/${row.id}`,
                            )
                          }
                        >
                          <IconEdit size={15} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          variant="light"
                          radius="md"
                          title="Delete"
                          onClick={() => confirmDelete(row.id)}
                        >
                          <IconTrash size={15} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                    <Table.Td c="dimmed" fz="sm">
                      {formatDate(row.createdAt)}
                    </Table.Td>
                  </Table.Tr>
                ))}
          </Table.Tbody>
        </Table>

        {totalPages > 1 && (
          <Group justify="flex-end" mt="md">
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              radius="md"
              size="sm"
            />
          </Group>
        )}
      </Paper>

      {/* Delete confirm modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Delete Sub Category"
        centered
        radius="md"
      >
        <Stack>
          <Text size="sm">
            Are you sure you want to delete this sub category? This action
            cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" radius="md" onClick={close}>
              Cancel
            </Button>
            <Button
              color="red"
              radius="md"
              loading={deleting}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
