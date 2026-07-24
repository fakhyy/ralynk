"use client";

import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThoughtEditor } from "@/components/editor/editor";
import { useCreateThought } from "@/hooks/use-thoughts";
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

export default function NewThoughtPage() {
  const createMutation = useCreateThought();
  const [saved, setSaved] = useState(false);

  const handleUpdate = useCallback(
    async (data: EditorData) => {
      if (!data.plainText.trim()) return;

      try {
        if (!saved) {
          const result = await createMutation.mutateAsync({
            title: data.title,
            content: data.json,
            plainText: data.plainText,
            snippet: data.snippet,
            wordCount: data.wordCount,
            characterCount: data.characterCount,
            readingTime: data.readingTime,
          });
          setSaved(true);
          window.history.replaceState(null, "", `/thought/${result.id}/edit`);
        } else {
          const path = window.location.pathname;
          const idMatch = path.match(/\/thought\/([^/]+)\/edit/);
          if (idMatch) {
            const { updateThought } = await import("@/server/actions/thought");
            await updateThought(idMatch[1], {
              title: data.title,
              content: data.json,
              plainText: data.plainText,
              snippet: data.snippet,
              wordCount: data.wordCount,
              characterCount: data.characterCount,
              readingTime: data.readingTime,
            });
          }
        }
      } catch (error) {
        console.error("Failed to save thought:", error);
      }
    },
    [saved, createMutation],
  );

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" render={<Link href="/" />}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      <ThoughtEditor onUpdate={handleUpdate} autofocus />
    </div>
  );
}
