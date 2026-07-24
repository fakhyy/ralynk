"use client";

import Link from "next/link";
import { Plus, Search, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Menu,
  MenuPopup,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/menu";
import { useSession } from "@/components/providers/session-provider";
import { motion } from "motion/react";

export function Header() {
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            className="text-lg font-semibold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            Noesis
          </motion.span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            A place for your thoughts.
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href="/thought/new" />}
            aria-label="New Thought"
          >
            <Plus className="size-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon-sm"
            render={<Link href="/?search=true" />}
            aria-label="Search"
          >
            <Search className="size-4" />
          </Button>

          <ThemeToggle />

          <Menu>
            <MenuTrigger
              render={
                <button
                  className="ml-1 flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
                  aria-label="User menu"
                />
              }
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? <User className="size-3.5" />}
            </MenuTrigger>
            <MenuPopup align="end" sideOffset={8}>
              <MenuItem render={<Link href="/settings" />}>
                <Settings className="size-4" />
                Settings
              </MenuItem>
              <MenuItem
                render={<button onClick={() => fetch("/api/auth/sign-out", { method: "POST" }).then(() => window.location.reload())} />}
              >
                <LogOut className="size-4" />
                Sign out
              </MenuItem>
            </MenuPopup>
          </Menu>
        </nav>
      </div>
    </header>
  );
}
