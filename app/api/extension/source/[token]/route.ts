import { NextResponse } from "next/server";

type ExtensionSource = {
  title: string;
  url: string;
  selection: string;
  text: string;
  createdAt: number;
};

const globalKey = "__tellmeExtensionSources";
const store = (() => {
  const root = globalThis as typeof globalThis & {
    [globalKey]?: Map<string, ExtensionSource>;
  };
  if (!root[globalKey]) root[globalKey] = new Map<string, ExtensionSource>();
  return root[globalKey]!;
})();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const source = store.get(token);

  if (!source || Date.now() - source.createdAt > 10 * 60 * 1000) {
    store.delete(token);
    return NextResponse.json({ error: "source expired" }, { status: 404 });
  }

  store.delete(token);

  return NextResponse.json({
    title: source.title,
    url: source.url,
    selection: source.selection,
    text: source.text,
  });
}
