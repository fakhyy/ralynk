"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useDeleteThought } from "@/hooks/use-thoughts";
import type { thought } from "@/db/schema";

type Thought = typeof thought.$inferSelect;

export function ReadingView({ thought }: { thought: Thought }) {
  const router = useRouter();
  const deleteMutation = useDeleteThought();

  const content = thought.content as Record<string, unknown>;
  const title = thought.title;
  const wordCount = thought.wordCount;
  const readingTime = thought.readingTime;
  const updatedAt = thought.updatedAt;

  async function handleDelete() {
    if (!confirm("Delete this thought?")) return;
    await deleteMutation.mutateAsync(thought.id);
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" size="sm" render={<Link href="/" />}>
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href={`/thought/${thought.id}/edit`} />}
              aria-label="Edit thought"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDelete}
              aria-label="Delete thought"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </div>

        <article>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground/50">
            <time>
              {new Date(updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{readingTime} min read</span>
          </div>

          <div className="my-6 h-px bg-border/50" />

          <div className="tiptap-content prose prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight">
            <TipTapRenderer content={content} />
          </div>
        </article>
      </motion.div>
    </div>
  );
}

function TipTapRenderer({ content }: { content: Record<string, unknown> }) {
  const nodes = (content as { content?: Record<string, unknown>[] }).content ?? [];
  return (
    <>
      {nodes.map((node, i) => (
        <NodeRenderer key={i} node={node} />
      ))}
    </>
  );
}

function NodeRenderer({ node }: { node: Record<string, unknown> }) {
  const type = node.type as string;
  const content = (node.content ?? []) as Record<string, unknown>[];
  const attrs = (node.attrs ?? {}) as Record<string, unknown>;

  const renderChildren = () =>
    content.map((child, i) => <NodeRenderer key={i} node={child} />);

  switch (type) {
    case "heading": {
      const level = attrs.level as number;
      const Tag = (`h${level}` as keyof React.JSX.IntrinsicElements) || "h2";
      return <Tag>{renderChildren()}</Tag>;
    }
    case "paragraph":
      return <p>{renderChildren()}</p>;
    case "bulletList":
      return <ul>{renderChildren()}</ul>;
    case "orderedList":
      return <ol>{renderChildren()}</ol>;
    case "listItem":
      return <li>{renderChildren()}</li>;
    case "taskList":
      return <ul className="list-none">{renderChildren()}</ul>;
    case "taskItem": {
      const checked = attrs.checked as boolean;
      return (
        <li className="flex items-start gap-2">
          <input type="checkbox" checked={checked} readOnly className="mt-1" />
          <span>{renderChildren()}</span>
        </li>
      );
    }
    case "blockquote":
      return <blockquote>{renderChildren()}</blockquote>;
    case "codeBlock": {
      const lang = attrs.language as string;
      return (
        <pre className="rounded-lg bg-muted p-4 text-sm font-mono">
          <code className={lang ? `language-${lang}` : ""}>
            {renderChildren()}
          </code>
        </pre>
      );
    }
    case "horizontalRule":
      return <hr className="my-6 border-border" />;
    case "text": {
      let text = <>{String(node.text ?? "")}</>;
      const marks = (node.marks ?? []) as Record<string, unknown>[];
      for (const mark of marks) {
        const markType = mark.type as string;
        if (markType === "bold") text = <strong>{text}</strong>;
        else if (markType === "italic") text = <em>{text}</em>;
        else if (markType === "code") text = <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{text}</code>;
        else if (markType === "link") {
          text = (
            <a
              href={mark.attrs ? (mark.attrs as Record<string, string>).href : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {text}
            </a>
          );
        } else if (markType === "strike") text = <del>{text}</del>;
        else if (markType === "underline") text = <u>{text}</u>;
      }
      return text;
    }
    case "table":
      return (
        <table className="border-collapse border border-border">
          <tbody>{renderChildren()}</tbody>
        </table>
      );
    case "tableRow":
      return <tr>{renderChildren()}</tr>;
    case "tableCell":
      return (
        <td className="border border-border px-3 py-2">{renderChildren()}</td>
      );
    case "tableHeader":
      return (
        <th className="border border-border px-3 py-2 font-semibold">
          {renderChildren()}
        </th>
      );
    case "hardBreak":
      return <br />;
    case "mathInline": {
      const latex = attrs.latex as string;
      return <code className="text-sm">{latex}</code>;
    }
    case "mathBlock": {
      const latex = attrs.latex as string;
      return (
        <pre className="my-4 rounded-lg bg-muted p-4 text-center font-mono text-sm">
          {latex}
        </pre>
      );
    }
    default:
      return <div>{renderChildren()}</div>;
  }
}
