"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/components/providers/session-provider";
import { motion } from "motion/react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/auth/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await fetch("/api/auth/delete-user", { method: "POST" });
      router.push("/login");
    } finally {
      setDeleting(false);
    }
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="mx-auto max-w-xl py:10 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>

        <div className="mt-10 space-y-10">
          <section className="space-y-4">
            <div>
              <h2 className="font-medium">Appearance</h2>
              {/* <p className="text-muted-foreground text-sm">Change how Noesis looks and feels in your browser.</p> */}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    theme === t.value
                      ? "border-foreground/20 bg-accent"
                      : "border-border hover:bg-accent/50"
                  }`}
                >
                  <t.icon className="size-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-medium">Account</h2>
            <form onSubmit={handleUpdateName} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Label htmlFor="name">Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" loading={saving}>
                    Save
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Label htmlFor="email-display">Email</Label>
                <Input
                  id="email-display"
                  value={user?.email ?? ""}
                  disabled
                  className="flex-1"
                />
              </div>
            </form>
          </section>

          <Separator />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="font-medium">Export</h2>
              <p className="text-xs text-muted-foreground">
                Download all your thoughts as a JSON file.
              </p>
            </div>
            <Button
              className="w-fit md:place-self-end"
              variant="secondary"
              onClick={async () => {
                const { exportThoughts } =
                  await import("@/server/actions/thought");
                const data = await exportThoughts();
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "noesis-thoughts.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export file
            </Button>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="font-medium">Danger Zone</h2>
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div>
                <h2 className="text-sm">Delete Account</h2>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all thoughts. <br /> This
                  action cannot be undone.
                </p>
              </div>
              <Button
                className="w-fit"
                variant="destructive"
                onClick={handleDeleteAccount}
                loading={deleting}
              >
                Delete Account
              </Button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
