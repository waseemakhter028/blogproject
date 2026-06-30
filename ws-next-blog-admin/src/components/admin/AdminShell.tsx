"use client";

import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Text,
  NavLink,
  ScrollArea,
  Avatar,
  Menu,
  UnstyledButton,
  Box,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import {
  IconDashboard,
  IconTag,
  IconTags,
  IconCode,
  IconLogout,
  IconChevronDown,
  IconUser,
} from "@tabler/icons-react";

const navItems = [
  { label: "Dashboard", href: "/adminpanel/dashboard", icon: IconDashboard },
  {
    label: "Manage Categories",
    href: "/adminpanel/category/list",
    icon: IconTag,
  },
  {
    label: "Manage Sub Categories",
    href: "/adminpanel/subcategory/list",
    icon: IconTags,
  },
  { label: "Manage Codes", href: "/adminpanel/code/list", icon: IconCode },
];

const SIDEBAR_BG = "#1e2a3a";
const SIDEBAR_ACTIVE = "#2c3e50";
const SIDEBAR_HOVER = "#243447";
const SIDEBAR_TEXT = "#b8c5d6";
const SIDEBAR_ACTIVE_TEXT = "#ffffff";

export default function AdminShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/adminpanel/login");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 290, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding={0}
    >
      {/* ── Header ─────────────────────────────── */}
      <AppShell.Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e9ecef",
          display: "flex",
          alignItems: "center",
          paddingInline: 16,
        }}
      >
        <Group justify="space-between" w="100%">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            {/* Logo */}
            <UnstyledButton
              onClick={() => router.push("/adminpanel/dashboard")}
              aria-label="Go to dashboard"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="WS Blog"
                style={{ height: 80, width: 225, objectFit: "contain" }}
              />
            </UnstyledButton>
          </Group>

          {/* User menu */}
          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar size={32} radius="xl" color="indigo">
                    <IconUser size={18} />
                  </Avatar>
                  <Box visibleFrom="sm">
                    <Text size="sm" fw={600} c="dark">
                      Welcome To WS Blog
                    </Text>
                  </Box>
                  <IconChevronDown size={14} color="#868e96" />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={handleLogout}
                disabled={loggingOut}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      {/* ── Sidebar ────────────────────────────── */}
      <AppShell.Navbar
        style={{ background: SIDEBAR_BG, borderRight: "none" }}
        p={0}
      >
        <ScrollArea style={{ flex: 1 }}>
          {/* Brand */}
          <Box
            px="md"
            py="sm"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              style={{ color: "#ffffff", letterSpacing: "0.1em" }}
            >
              WSBLog Admin
            </Text>
          </Box>

          <Box p="xs" pt="sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/adminpanel/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <NavLink
                  key={item.href}
                  label={item.label}
                  leftSection={
                    <Icon size={16} color={isActive ? "#fff" : SIDEBAR_TEXT} />
                  }
                  onClick={() => router.push(item.href)}
                  active={isActive}
                  styles={{
                    root: {
                      borderRadius: 8,
                      marginBottom: 4,
                      color: isActive ? SIDEBAR_ACTIVE_TEXT : SIDEBAR_TEXT,
                      backgroundColor: isActive
                        ? SIDEBAR_ACTIVE
                        : "transparent",
                      fontWeight: isActive ? 600 : 400,
                      "&:hover": {
                        backgroundColor: isActive
                          ? SIDEBAR_ACTIVE
                          : SIDEBAR_HOVER,
                        color: "#fff",
                      },
                    },
                    label: {
                      fontSize: "0.875rem",
                    },
                  }}
                />
              );
            })}
          </Box>
        </ScrollArea>

        {/* Sidebar footer */}
        <Divider style={{ borderColor: "rgba(255,255,255,0.07)" }} />
        <Box p="md">
          <UnstyledButton
            w="100%"
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 8,
              color: "#e06c75",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "background 0.15s",
            }}
          >
            <IconLogout size={16} />
            Logout
          </UnstyledButton>
        </Box>
      </AppShell.Navbar>

      {/* ── Main content ───────────────────────── */}
      <AppShell.Main style={{ background: "#f4f6f9", minHeight: "100vh" }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
