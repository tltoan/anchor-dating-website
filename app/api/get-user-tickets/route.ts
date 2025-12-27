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

    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Missing phone number" },
        { status: 400 }
      );
    }

    // Normalize phone number for comparison
    const normalizePhone = (phone: string) => {
      if (!phone) return "";
      return phone.replace(/[\s\-\(\)\+]/g, "");
    };

    const normalizedPhone = normalizePhone(phone);

    // Get all tickets from tickets table and filter by normalized phone
    const { data: allTickets, error: fetchError } = await supabase
      .from("tickets")
      .select("*")
      .order("ticket_purchased_at", { ascending: false });

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

    // Filter tickets by normalized phone number
    const data = allTickets?.filter(
      (t) => normalizePhone(t.phone || "") === normalizedPhone
    ) || [];

    return NextResponse.json({ success: true, tickets: data || [] });
  } catch (error: any) {
    console.error("Get user tickets error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

