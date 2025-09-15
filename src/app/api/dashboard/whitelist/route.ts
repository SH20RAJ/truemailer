import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { PersonalListService } from "@/lib/db";

interface WhitelistRequest {
  emailOrDomain: string;
  type: 'email' | 'domain';
  reason?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const personalListService = new PersonalListService();
    const whitelist = await personalListService.getWhitelist(user.id);

    return NextResponse.json({ 
      success: true,
      whitelist
    });
  } catch (error) {
    console.error("Error fetching whitelist:", error);
    return NextResponse.json(
      { error: "Failed to fetch whitelist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as WhitelistRequest;
    const { emailOrDomain, type, reason } = body;

    // Validate input
    if (!emailOrDomain || !type) {
      return NextResponse.json(
        { error: "emailOrDomain and type are required" },
        { status: 400 }
      );
    }

    if (type !== 'email' && type !== 'domain') {
      return NextResponse.json(
        { error: "type must be 'email' or 'domain'" },
        { status: 400 }
      );
    }

    // Validate email format if type is email
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrDomain)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    // Validate domain format if type is domain
    if (type === 'domain') {
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(emailOrDomain)) {
        return NextResponse.json(
          { error: "Invalid domain format" },
          { status: 400 }
        );
      }
    }

    const personalListService = new PersonalListService();
    const newEntry = await personalListService.addToWhitelist(
      user.id,
      emailOrDomain,
      type,
      reason
    );

    return NextResponse.json({ 
      success: true,
      entry: newEntry
    });
  } catch (error) {
    console.error("Error adding to whitelist:", error);
    return NextResponse.json(
      { error: "Failed to add to whitelist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the current user
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      );
    }

    const personalListService = new PersonalListService();
    await personalListService.removeFromWhitelist(user.id, parseInt(id));

    return NextResponse.json({ 
      success: true,
      message: "Entry removed from whitelist"
    });
  } catch (error) {
    console.error("Error removing from whitelist:", error);
    return NextResponse.json(
      { error: "Failed to remove from whitelist" },
      { status: 500 }
    );
  }
}