import { NextResponse } from "next/server";
import { assistField } from "@/lib/ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { field, question, language } = (await req.json()) as {
    field?: string;
    question?: string;
    language?: string;
  };
  if (!field && !question) {
    return NextResponse.json({ error: "Ask a question about a field." }, { status: 400 });
  }
  const result = await assistField(field || "general", question || field || "", language || "English");
  return NextResponse.json(result);
}
