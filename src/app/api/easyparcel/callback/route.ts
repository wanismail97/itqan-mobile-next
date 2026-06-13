// ─── EasyParcel OAuth Callback ───────────────────────────────────────────────
// GET /api/easyparcel/callback
// EasyParcel redirects here after user authorizes the application.
// We exchange the authorization code for an access_token and refresh_token,
// log the tokens securely on the server, and return a simple success page.
//
// Flow:
// 1. Read ?code= from query params
// 2. POST https://api.easyparcel.com/oauth/token
//    - Basic Auth: base64(client_id:client_secret)
//    - Body: grant_type=authorization_code, redirect_uri, code
// 3. Parse { access_token, refresh_token, expires_at }
// 4. Log tokens server-side (NEVER expose to browser)
// 5. Return simple HTML success page

import { NextRequest, NextResponse } from "next/server";
import { updateEasyParcelTokens } from "@/lib/airtable";

// ─── Constants ─────────────────────────────────────────────────────────────

const EASYPARCEL_TOKEN_URL = "https://api.easyparcel.com/oauth/token";
const REDIRECT_URI = "https://itqanmobile.my/api/easyparcel/callback";

// ─── GET Handler ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // ─── 1. Read query param: code ────────────────────────────────────
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    // ─── 2. Validate code exists ──────────────────────────────────────
    if (!code) {
      console.error("EasyParcel OAuth callback: Missing authorization code.");
      return new NextResponse(
        "<h1>EasyParcel OAuth Error</h1><p>Missing authorization code.</p>",
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    // ─── 3. Read credentials from env ─────────────────────────────────
    const clientId = process.env.EASYPARCEL_CLIENT_ID;
    const clientSecret = process.env.EASYPARCEL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error(
        "EasyParcel OAuth callback: Missing EASYPARCEL_CLIENT_ID or EASYPARCEL_CLIENT_SECRET env var."
      );
      return new NextResponse(
        "<h1>EasyParcel OAuth Error</h1><p>Server configuration error.</p>",
        {
          status: 500,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    // ─── 4. Build Basic Auth header ───────────────────────────────────
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    // ─── 5. Exchange code for token ───────────────────────────────────
    const tokenResponse = await fetch(EASYPARCEL_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code,
      }).toString(),
    });

    // ─── 6. Parse response ────────────────────────────────────────────
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("EasyParcel OAuth token exchange failed:", {
        status: tokenResponse.status,
        body: tokenData,
      });
      return new NextResponse(
        "<h1>EasyParcel OAuth Error</h1><p>Token exchange failed. Check server logs.</p>",
        {
          status: 502,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    // ─── 7. Persist tokens to Airtable ────────────────────────────────
    const persisted = await updateEasyParcelTokens({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: String(tokenData.expires_at || ""),
    });

    if (!persisted) {
      console.error("EasyParcel OAuth: Failed to persist tokens to Airtable");
      return new NextResponse(
        "<h1>EasyParcel OAuth Error</h1><p>Failed to persist EasyParcel tokens.</p>",
        {
          status: 500,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    console.log("EasyParcel OAuth connected successfully");

    // ─── 8. Return simple success page ────────────────────────────────
    return new NextResponse(
      "<h1>EasyParcel OAuth connected successfully</h1>",
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (err) {
    console.error("EasyParcel OAuth callback exception:", err);
    return new NextResponse(
      "<h1>EasyParcel OAuth Error</h1><p>An unexpected error occurred. Check server logs.</p>",
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}