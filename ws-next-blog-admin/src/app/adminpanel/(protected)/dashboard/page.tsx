"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Group,
  Text,
  Title,
  Table,
  TextInput,
  SimpleGrid,
  ThemeIcon,
  Skeleton,
  Paper,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import {
  IconTag,
  IconTags,
  IconCode,
  IconHome,
  IconSearch,
} from "@tabler/icons-react";

const SKELETON_ROWS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

interface DashboardData {
  cat: number;
  subcat: number;
  code: number;
  latest_cat: { id: number; name: string; created_at: string }[];
}

function StatCard({
  label,
  value,
  color,
  icon,
  href,
}: Readonly<{
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  href: string;
}>) {
  return (
    <Card
      component="a"
      href={href}
      p="lg"
      radius="md"
      style={{
        background: color,
        cursor: "pointer",
        textDecoration: "none",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 24px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Box>
          <Text size="sm" fw={600} c="white" mb={4} style={{ opacity: 0.9 }}>
            {label}
          </Text>
          <Title order={2} c="white" fw={800}>
            {value}
          </Title>
        </Box>
        <ThemeIcon
          size={48}
          radius="xl"
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
        >
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const filteredCats = data?.latest_cat.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

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

  const renderTableBody = () => {
    if (!filteredCats || filteredCats.length === 0) {
      return (
        <Table.Tr>
          <Table.Td colSpan={3} ta="center" c="dimmed" py="lg">
            No categories found.
          </Table.Td>
        </Table.Tr>
      );
    }
    return filteredCats.map((row, idx) => (
      <Table.Tr key={row.id}>
        <Table.Td>{idx + 1}</Table.Td>
        <Table.Td>{row.name}</Table.Td>
        <Table.Td>{formatDate(row.created_at)}</Table.Td>
      </Table.Tr>
    ));
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
          <ThemeIcon size={36} radius="md" color="blue">
            <IconHome size={20} />
          </ThemeIcon>
          <Box>
            <Title order={4} fw={700}>
              Dashboard
            </Title>
            <Breadcrumbs separator="›" fz="xs" c="dimmed">
              <Anchor href="/adminpanel/dashboard" fz="xs">
                Admin
              </Anchor>
              <Text fz="xs">Dashboard</Text>
            </Breadcrumbs>
          </Box>
        </Group>
      </Paper>

      {/* Stat cards */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
        {data ? (
          <>
            <StatCard
              label="Total Categories"
              value={data.cat}
              color="linear-gradient(135deg, #2196f3, #1565c0)"
              icon={<IconTag size={24} />}
              href="/adminpanel/category/list"
            />
            <StatCard
              label="Total Sub Categories"
              value={data.subcat}
              color="linear-gradient(135deg, #26c281, #0d9e6e)"
              icon={<IconTags size={24} />}
              href="/adminpanel/subcategory/list"
            />
            <StatCard
              label="Total Codes"
              value={data.code}
              color="linear-gradient(135deg, #f44336, #c0392b)"
              icon={<IconCode size={24} />}
              href="/adminpanel/code/list"
            />
          </>
        ) : (
          <>
            <Skeleton height={110} radius="md" />
            <Skeleton height={110} radius="md" />
            <Skeleton height={110} radius="md" />
          </>
        )}
      </SimpleGrid>

      {/* Latest categories table */}
      <Paper radius="md" shadow="xs" p="lg" style={{ background: "#fff" }}>
        <Group justify="space-between" mb="md">
          <Title order={5} c="blue" fw={700}>
            Latest Categories
          </Title>
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={14} />}
            size="xs"
            radius="md"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ width: 200 }}
            styles={{ input: { background: "#fff" } }}
          />
        </Group>

        <Table
          striped
          highlightOnHover
          withTableBorder
          stripedColor="#f8f9fa"
          highlightOnHoverColor="#e9ecef"
          withColumnBorders
          styles={{
            thead: { background: "#2c3e50" },
            th: { color: "#ffffff", fontWeight: 600 },
            tbody: { background: "#ffffff" },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={80}>S.No</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Created On</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data
              ? renderTableBody()
              : Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={SKELETON_ROWS[i]}>
                    <Table.Td>
                      <Skeleton height={16} radius="sm" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={16} radius="sm" />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={16} radius="sm" />
                    </Table.Td>
                  </Table.Tr>
                ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Box>
  );
}
