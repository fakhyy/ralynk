"use server";

import { eq, and, desc, or, ilike } from "drizzle-orm";
import { db } from "@/db";
import { thought } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function createThought(data: {
  title: string;
  content: string;
  plainText: string;
  snippet: string;
  wordCount: number;
  characterCount: number;
  readingTime: number;
}) {
  const user = await requireSession();
  const now = new Date();

  const [created] = await db
    .insert(thought)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      title: data.title,
      content: JSON.parse(data.content),
      plainText: data.plainText,
      snippet: data.snippet,
      wordCount: data.wordCount,
      characterCount: data.characterCount,
      readingTime: data.readingTime,
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: thought.id });

  revalidatePath("/");
  return { id: created.id };
}

export async function updateThought(
  id: string,
  data: {
    title: string;
    content: string;
    plainText: string;
    snippet: string;
    wordCount: number;
    characterCount: number;
    readingTime: number;
  },
) {
  const user = await requireSession();

  await db
    .update(thought)
    .set({
      title: data.title,
      content: JSON.parse(data.content),
      plainText: data.plainText,
      snippet: data.snippet,
      wordCount: data.wordCount,
      characterCount: data.characterCount,
      readingTime: data.readingTime,
      updatedAt: new Date(),
    })
    .where(and(eq(thought.id, id), eq(thought.userId, user.id)));

  revalidatePath("/");
  revalidatePath(`/thought/${id}`);
}

export async function deleteThought(id: string) {
  const user = await requireSession();
  await db.delete(thought).where(and(eq(thought.id, id), eq(thought.userId, user.id)));
  revalidatePath("/");
}

export async function getThoughts() {
  const user = await requireSession();

  const thoughts = await db
    .select({
      id: thought.id,
      title: thought.title,
      snippet: thought.snippet,
      updatedAt: thought.updatedAt,
    })
    .from(thought)
    .where(eq(thought.userId, user.id))
    .orderBy(desc(thought.updatedAt));

  return thoughts;
}

export async function getThought(id: string) {
  const user = await requireSession();

  const [result] = await db
    .select()
    .from(thought)
    .where(and(eq(thought.id, id), eq(thought.userId, user.id)));

  return result ?? null;
}

export async function searchThoughts(query: string) {
  const user = await requireSession();

  if (!query.trim()) return [];

  const results = await db
    .select({
      id: thought.id,
      title: thought.title,
      snippet: thought.snippet,
      updatedAt: thought.updatedAt,
    })
    .from(thought)
    .where(
      and(
        eq(thought.userId, user.id),
        or(
          ilike(thought.title, `%${query}%`),
          ilike(thought.plainText, `%${query}%`),
        ),
      ),
    )
    .orderBy(desc(thought.updatedAt))
    .limit(10);

  return results;
}

export async function exportThoughts(): Promise<string> {
  const user = await requireSession();

  const thoughts = await db
    .select()
    .from(thought)
    .where(eq(thought.userId, user.id))
    .orderBy(desc(thought.createdAt));

  const exportData = thoughts.map((t) => ({
    title: t.title,
    content: t.plainText,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  return JSON.stringify(exportData, null, 2);
}
