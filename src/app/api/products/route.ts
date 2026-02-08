import { NextResponse } from "next/server";

import { getActiveProducts } from "@/lib/data-store";

export async function GET() {
  const products = await getActiveProducts();
  return NextResponse.json({ products });
}

