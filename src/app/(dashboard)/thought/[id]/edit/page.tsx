"use client";

import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThoughtEditor } from "@/components/editor/editor";
import { useThought, useUpdateThought } from "@/hooks/use-thoughts";
import Link from "next/link";

type EditorData = {
  json: string;
  plainText: string;
  wordCount: number;
  characterCount: number;
  readingTime: number;
  title: string;
  snippet: string;
};

export default function EditThoughtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<string | null>(null);
  const updateMutation = useUpdateThought();

  params.then((p) => setResolvedParams(p.id));

  const { data: thought, isLoading } = useThought(resolvedParams ?? "");

  const handleUpdate = useCallback(
    async (data: EditorData) => {
      if (!resolvedParams) return;

      try {
        await updateMutation.mutateAsync({
          id: resolvedParams,
          title: data.title,
          content: data.json,
          plainText: data.plainText,
          snippet: data.snippet,
          wordCount: data.wordCount,
          characterCount: data.characterCount,
          readingTime: data.readingTime,
        });
      } catch (error) {
        console.error("Failed to save thought:", error);
      }
    },
    [resolvedParams, updateMutation],
  );

  if (isLoading || !thought) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-24 rounded bg-muted" />
          <div className="h-12 w-64 rounded bg-muted" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={`/thought/${resolvedParams}`} />}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      <ThoughtEditor
        initialContent={JSON.stringify(thought.content)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
