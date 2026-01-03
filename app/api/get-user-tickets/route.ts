import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase credentials not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user_id" },
        { status: 400 }
      );
    }

    // Get tickets by user_id
    const { data: tickets, error: fetchError } = await supabase
      .from("tickets")
      .select("id, user_id, payment_intent_id, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Supabase error:", fetchError);
      // If table doesn't exist, provide helpful error message
      if (fetchError.code === "42P01" || fetchError.message?.includes("does not exist")) {
        return NextResponse.json(
          { 
            error: "Tickets table does not exist. Please run create-tickets-table.sql in Supabase SQL Editor.",
            code: fetchError.code,
            details: fetchError.message
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { 
          error: "Failed to fetch tickets",
          details: fetchError.message,
          code: fetchError.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, tickets: tickets || [] });
  } catch (error: any) {
    console.error("Get user tickets error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

