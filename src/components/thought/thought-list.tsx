"use client";

import Link from "next/link";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { motion } from "motion/react";

type Thought = {
  id: string;
  title: string;
  snippet: string | null;
  updatedAt: Date;
};

function getTimeGroup(date: Date): string {
  const now = new Date();
  const days = differenceInDays(now, date);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (days <= 7) return "Last Week";
  if (days <= 30) return "This Month";
  return "Earlier";
}

function groupThoughts(thoughts: Thought[]): Map<string, Thought[]> {
  const groups = new Map<string, Thought[]>();

  for (const thought of thoughts) {
    const group = getTimeGroup(thought.updatedAt);
    const existing = groups.get(group) ?? [];
    existing.push(thought);
    groups.set(group, existing);
  }

  return groups;
}

export function ThoughtList({ thoughts }: { thoughts: Thought[] }) {
  const grouped = groupThoughts(thoughts);

  if (thoughts.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-32 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-lg text-muted-foreground">No thoughts yet.</p>
        <p className="mt-2 text-sm text-muted-foreground/60">
          Click the + button to start writing.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      {Array.from(grouped.entries()).map(([label, items]) => (
        <section key={label}>
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            {label}
          </h2>
          <div className="space-y-1">
            {items.map((thought, i) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <Link
                  href={`/thought/${thought.id}`}
                  className="group block rounded-lg px-3 py-3 transition-colors hover:bg-accent/50"
                >
                  <h3 className="text-base font-medium text-foreground transition-colors group-hover:text-primary sm:text-lg">
                    {thought.title}
                  </h3>
                  {thought.snippet && (
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground/70">
                      {thought.snippet}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-muted-foreground/40">
                    {format(thought.updatedAt, "MMM d, yyyy · h:mm a")}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
