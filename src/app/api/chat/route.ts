import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { products } from "@/data/products";
import { getSessionUser } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (!session) {
      return NextResponse.json(
        { reply: "Please sign in to use the shopping assistant." },
        { status: 401 },
      );
    }

    const chatLimit = checkRateLimit(req, "ai-chat", 20, 60 * 1000, session.id);
    if (!chatLimit.allowed) {
      return NextResponse.json(
        { reply: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(chatLimit.retryAfterSeconds) },
        },
      );
    }

    const body = await req.json();
    const message = String(body?.message || "").trim();

    if (!message || message.length > 1000) {
      return NextResponse.json(
        { reply: "Please enter a product question up to 1000 characters." },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { reply: "The shopping assistant is temporarily unavailable." },
        { status: 503 },
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const catalog = products
      .map(
        (product) =>
          `${product.name} | category: ${product.range} | price: ${product.price} | ${product.des}`,
      )
      .join("\n");

    const response = await openai.responses.create({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            "You are PhoneStore's concise shopping assistant. Answer only questions about the provided store catalog. Never invent specs that are not in the catalog. If the answer is not available, say so clearly.\n\nCatalog:\n" +
            catalog,
        },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({
      reply: response.output_text || "I could not generate an answer.",
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { reply: "The shopping assistant is temporarily unavailable." },
      { status: 500 },
    );
  }
}
