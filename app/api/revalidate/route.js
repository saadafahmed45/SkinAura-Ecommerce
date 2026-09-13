import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand cache revalidation endpoint
 * Call via POST or GET with ?tag=products or ?path=/product
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tag = body.tag || request.nextUrl.searchParams.get("tag");
    const path = body.path || request.nextUrl.searchParams.get("path");

    if (!tag && !path) {
      return NextResponse.json(
        { message: "Missing tag or path to revalidate" },
        { status: 400 }
      );
    }

    if (tag) {
      revalidateTag(tag);
    }

    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || null,
      path: path || null,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Error revalidating" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return POST(request);
}
