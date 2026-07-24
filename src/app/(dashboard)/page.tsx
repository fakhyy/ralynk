"use client";

import { useThoughts } from "@/hooks/use-thoughts";
import { ThoughtList } from "@/components/thought/thought-list";
import { SearchDialog } from "@/components/search/search-dialog";

function Timeline() {
  const { data: thoughts, isLoading } = useThoughts();

  if (isLoading) {
    return (
      <div className="space-y-12 py-8">
        {["Today", "Yesterday", "Last Week"].map((label) => (
          <section key={label}>
            <div className="mb-4 h-3 w-16 rounded bg-muted" />
            <div className="space-y-1">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-lg px-3 py-3">
                  <div className="h-5 w-48 rounded bg-muted" />
                  <div className="mt-2 h-3 w-72 rounded bg-muted/50" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return <ThoughtList thoughts={thoughts ?? []} />;
}

export default function HomePage() {
  return (
    <>
      <SearchDialog />
      <Timeline />
    </>
  );
}
