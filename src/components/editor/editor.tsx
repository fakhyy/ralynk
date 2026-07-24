"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "./extensions";
import { motion } from "motion/react";

type ThoughtEditorProps = {
  initialContent?: string | null;
  onUpdate?: (data: {
    json: string;
    plainText: string;
    wordCount: number;
    characterCount: number;
    readingTime: number;
    title: string;
    snippet: string;
  }) => void;
  editable?: boolean;
  autofocus?: boolean;
};

function extractTitle(json: ReturnType<typeof JSON.parse>): string {
  const content = json.content;
  if (!content || !Array.isArray(content)) return "Untitled";

  const firstNode = content[0];
  if (!firstNode) return "Untitled";

  if (firstNode.type === "heading") {
    return nodeToText(firstNode) || "Untitled";
  }

  const text = nodeToText(firstNode);
  if (!text) return "Untitled";

  const sentence = text.split(/[.!?]+/)[0];
  return sentence?.trim().slice(0, 120) || "Untitled";
}

function nodeToText(node: Record<string, unknown>): string {
  if (node.text) return String(node.text);
  if (Array.isArray(node.content)) {
    return node.content.map((n: Record<string, unknown>) => nodeToText(n)).join("");
  }
  return "";
}

function generateSnippet(plainText: string): string {
  const cleaned = plainText.replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 200);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function ThoughtEditor({
  initialContent,
  onUpdate,
  editable = true,
  autofocus = true,
}: ThoughtEditorProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const editor = useEditor({
    extensions,
    content: initialContent ? JSON.parse(initialContent) : "",
    editable,
    autofocus,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[50vh] prose-p:leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight",
      },
    },
    onUpdate: ({ editor }) => {
      if (!onUpdate) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        const json = JSON.stringify(editor.getJSON());
        const plainText = editor.getText();
        const wordCount = countWords(plainText);
        const characterCount = plainText.length;
        const readingTime = estimateReadingTime(wordCount);
        const title = extractTitle(editor.getJSON());
        const snippet = generateSnippet(plainText);

        onUpdate({
          json,
          plainText,
          wordCount,
          characterCount,
          readingTime,
          title,
          snippet,
        });
      }, 500);
    },
  });

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!editor) {
    return (
      <div className="min-h-[50vh] animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </motion.div>
  );
}
