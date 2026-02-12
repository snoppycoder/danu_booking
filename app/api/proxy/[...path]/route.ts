export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const TARGET_URL = process.env.API_BASE_URL!;

// ---------------- ROUTE HANDLERS ----------------

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, "GET");
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, "POST");
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, "DELETE");
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, "PATCH");
}

export async function OPTIONS() {
  return buildCorsResponse();
}

// ---------------- CORE PROXY ----------------

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string,
) {
  try {
    const path = pathSegments.join("/");
    const url = new URL(`${TARGET_URL}/${path}`);

    // Forward query params
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // ----------- FORWARD HEADERS -----------
    const headers = new Headers();

    request.headers.forEach((value, key) => {
      const lower = key.toLowerCase();

      // Skip unsafe hop-by-hop headers
      if (
        lower === "host" ||
        lower === "content-length" ||
        lower === "connection"
      ) {
        return;
      }

      headers.set(key, value);
    });

    // ----------- HANDLE BODY SAFELY (Node runtime fix) -----------
    let body: BodyInit | undefined;

    if (!["GET", "HEAD"].includes(method)) {
      const contentType = request.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        body = await request.text();
      } else if (contentType.includes("multipart/form-data")) {
        body = await request.arrayBuffer();
      } else {
        body = await request.arrayBuffer();
      }
    }

    // ----------- MAKE REQUEST -----------
    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
      redirect: "manual",
    });

    // ----------- FORWARD RESPONSE -----------
    const responseHeaders = new Headers();

    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();

      if (lower === "transfer-encoding" || lower === "connection") {
        return;
      }

      responseHeaders.set(key, value);
    });

    // Apply CORS
    applyCors(responseHeaders);

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Proxy Error", { status: 500 });
  }
}

// ---------------- CORS ----------------

function applyCors(headers: Headers) {
  headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-API-Key, Cookie",
  );
  headers.set("Vary", "Origin");
}

function buildCorsResponse() {
  const headers = new Headers();
  applyCors(headers);
  return new NextResponse(null, { status: 200, headers });
}
