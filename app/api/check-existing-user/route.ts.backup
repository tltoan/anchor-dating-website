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

    // Normalize phone number (remove spaces, dashes, parentheses, plus signs for comparison)
    const normalizePhone = (phone: string) => {
      if (!phone) return "";
      return phone.replace(/[\s\-\(\)\+]/g, "");
    };

    const normalizedPhone = normalizePhone(phone);
    console.log("Checking for phone:", phone, "Normalized:", normalizedPhone);

    // Get all users and filter by normalized phone (since Supabase might store it differently)
    const { data: allUsers, error: fetchError } = await supabase
      .from("waitlist")
      .select("*");

    if (fetchError) {
      console.error("Supabase error:", fetchError);
      return NextResponse.json(
        { error: "Failed to check user", details: fetchError.message },
        { status: 500 }
      );
    }

    // Find user by normalized phone number
    const user = allUsers?.find((u) => {
      const storedPhone = normalizePhone(u.phone || "");
      return storedPhone === normalizedPhone;
    });

    // If user exists, get their tickets from tickets table
    let tickets = [];
    if (user) {
      // Get all tickets from tickets table and filter by normalized phone
      const { data: allTickets, error: ticketsError } = await supabase
        .from("tickets")
        .select("*")
        .order("ticket_purchased_at", { ascending: false });

      if (!ticketsError && allTickets) {
        // Filter tickets by normalized phone number
        tickets = allTickets.filter(
          (t) => normalizePhone(t.phone || "") === normalizedPhone
        );
      }
      
      console.log("Found user:", user.email, "Tickets:", tickets.length);
    } else {
      console.log("No user found with phone:", normalizedPhone);
    }

    return NextResponse.json({
      exists: !!user,
      user: user || null,
      tickets: tickets,
    });
  } catch (error: any) {
    console.error("Check existing user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check user" },
      { status: 500 }
    );
  }
}

