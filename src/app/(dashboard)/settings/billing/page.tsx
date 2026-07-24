"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import Link from "next/link";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-lg py-8">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-8">
          <Button variant="ghost" size="sm" render={<Link href="/settings" />}>
            <ArrowLeft className="size-4" />
            Back to Settings
          </Button>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and billing.
        </p>

        <div className="mt-10 space-y-8">
          <section className="rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Free Plan</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Unlimited thoughts, search, and dark mode.
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Current
              </span>
            </div>
          </section>

          <Separator />

          <section className="rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pro Plan</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Coming soon. Future features only.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
