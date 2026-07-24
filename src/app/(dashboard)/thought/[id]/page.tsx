import { notFound } from "next/navigation";
import { getThought } from "@/server/actions/thought";
import { ReadingView } from "./reading-view";

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thought = await getThought(id);

  if (!thought) {
    notFound();
  }

  return <ReadingView thought={thought} />;
}
