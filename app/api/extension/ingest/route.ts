import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

type ExtensionSource = {
  title: string;
  url: string;
  selection: string;
  text: string;
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

    if (!title || !url) {
      return cors(NextResponse.json({ error: "title and url are required" }, { status: 400 }));
    }

    const store = getStore();
    const token = randomUUID();

    store.set(token, { title, url, selection, text, createdAt: Date.now() });

    for (const [key, value] of store) {
      if (Date.now() - value.createdAt > 10 * 60 * 1000) {
        store.delete(key);
      }
    }

    return cors(NextResponse.json({ token }));
  } catch {
    return cors(NextResponse.json({ error: "invalid request" }, { status: 400 }));
  }
}
