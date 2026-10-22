import { NextResponse } from "next/server";
import { answer } from "@/lib/engine";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string" || question.length > 300) {
      return NextResponse.json({ answer: "Please send a question under 300 characters.", source: "none" }, { status: 400 });
    }
    return NextResponse.json(answer(question));
  } catch {
    return NextResponse.json({ answer: "Something went wrong. Try again.", source: "none" }, { status: 500 });
  }
}
