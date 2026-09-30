import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

type ExtensionSegment = {
  id?: string;
  kind?: string;
  label?: string;
  text: string;
  author?: string;
  depth?: number;
  source?: string;
};

type ExtensionSource = {
  title: string;
  url: string;
  selection: string;
  text: string;
  contentType: string;
  segments: ExtensionSegment[];
  createdAt: number;
};

const globalKey = "__tellmeExtensionSources";

function getStore() {
  const root = globalThis as typeof globalThis & {
    [globalKey]?: Map<string, ExtensionSource>;
  };

  if (!root[globalKey]) {
    root[globalKey] = new Map();
  }

  return root[globalKey]!;
}

function cors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = typeof body?.title === "string" ? body.title.slice(0, 500) : "";
    const url = typeof body?.url === "string" ? body.url.slice(0, 2000) : "";
    const selection = typeof body?.selection === "string" ? body.selection.slice(0, 20000) : "";
    const text = typeof body?.text === "string" ? body.text.slice(0, 120000) : "";
    const contentType = typeof body?.contentType === "string" ? body.contentType.slice(0, 80) : "webpage";

    const segments = Array.isArray(body?.segments)
      ? body.segments
          .filter((item: unknown): item is ExtensionSegment =>
            Boolean(item && typeof item === "object" && typeof (item as ExtensionSegment).text === "string")
          )
          .slice(0, 62)
          .map((item: ExtensionSegment) => ({
            id: typeof item.id === "string" ? item.id.slice(0, 100) : undefined,
            kind: typeof item.kind === "string" ? item.kind.slice(0, 40) : "content",
            label: typeof item.label === "string" ? item.label.slice(0, 80) : "Content",
            text: item.text.slice(0, 12000),
            author: typeof item.author === "string" ? item.author.slice(0, 160) : undefined,
            depth: typeof item.depth === "number" ? Math.max(0, Math.min(12, item.depth)) : 0,
            source: typeof item.source === "string" ? item.source.slice(0, 120) : undefined
          }))
      : [];

    if (!title || !url) {
      return cors(
        NextResponse.json({ error: "title and url are required" }, { status: 400 })
      );
    }

    const store = getStore();
    const token = randomUUID();

    store.set(token, {
      title,
      url,
      selection,
      text,
      contentType,
      segments,
      createdAt: Date.now()
    });

    for (const [key, value] of store) {
      if (Date.now() - value.createdAt > 10 * 60 * 1000) {
        store.delete(key);
      }
    }

    return cors(NextResponse.json({ token, segmentCount: segments.length }));
  } catch {
    return cors(NextResponse.json({ error: "invalid request" }, { status: 400 }));
  }
}