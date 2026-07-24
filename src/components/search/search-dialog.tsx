"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogPopup,
} from "@/components/ui/dialog";
import { useSearchThoughts } from "@/hooks/use-thoughts";
import { motion, AnimatePresence } from "motion/react";

function SearchDialogInner() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data: results } = useSearchThoughts(query);

  useEffect(() => {
    if (searchParams.get("search") === "true") {
      setOpen(true);
      window.history.replaceState(null, "", "/");
    }
  }, [searchParams]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/thought/${id}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup className="sm:max-w-lg p-0 gap-0">
        <div className="flex items-center border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            className="flex h-12 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
            placeholder="What are you trying to remember?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="pointer-events-none hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() && results && results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No thoughts found.
            </p>
          )}

          {!query.trim() && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Start typing to search...
            </p>
          )}

          <AnimatePresence>
            {results?.map((result) => (
              <motion.button
                key={result.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="flex w-full flex-col gap-1 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent"
                onClick={() => handleSelect(result.id)}
              >
                <span className="text-sm font-medium">{result.title}</span>
                {result.snippet && (
                  <span className="line-clamp-1 text-xs text-muted-foreground/70">
                    {result.snippet}
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground/40">
                  {new Date(result.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </DialogPopup>
    </Dialog>
  );
}

export function SearchDialog() {
  return (
    <Suspense>
      <SearchDialogInner />
    </Suspense>
  );
}
