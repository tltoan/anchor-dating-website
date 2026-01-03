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

    const { phone, email } = await request.json();

    if (!phone && !email) {
      return NextResponse.json(
        { error: "Missing phone number or email" },
        { status: 400 }
      );
    }

    // Normalize phone number (remove spaces, dashes, parentheses, plus signs for comparison)
    const normalizePhone = (phone: string) => {
      if (!phone) return "";
      return phone.replace(/[\s\-\(\)\+]/g, "");
    };

    const normalizedPhone = phone ? normalizePhone(phone) : "";
    const normalizedEmail = email ? email.toLowerCase().trim() : "";
    console.log("Checking for phone:", phone, "email:", email);

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

    // Find users by email and phone separately
    let userByPhone = null;
    let userByEmail = null;

    if (normalizedPhone) {
      userByPhone = allUsers?.find((u) => {
        const storedPhone = normalizePhone(u.phone || "");
        return storedPhone === normalizedPhone;
      });
    }

    if (normalizedEmail) {
      userByEmail = allUsers?.find((u) => {
        const storedEmail = (u.email || "").toLowerCase().trim();
        return storedEmail === normalizedEmail;
      });
    }

    // Check for mismatches
    let mismatchError = null;
    if (userByPhone && userByEmail) {
      // Both exist - check if they're the same user
      if (userByPhone.id !== userByEmail.id) {
        // Different users - mismatch!
        mismatchError = {
          type: "both_mismatch",
          message: "This email is already registered with a different phone number, and this phone number is already registered with a different email.",
        };
      }
    } else if (userByPhone && !userByEmail && normalizedEmail) {
      // Phone exists but email doesn't match
      mismatchError = {
        type: "email_mismatch",
        message: "This phone number is already registered with a different email address.",
      };
    } else if (userByEmail && !userByPhone && normalizedPhone) {
      // Email exists but phone doesn't match
      mismatchError = {
        type: "phone_mismatch",
        message: "This email is already registered with a different phone number.",
      };
    }

    // If there's a mismatch, return error immediately
    if (mismatchError) {
      return NextResponse.json(
        {
          exists: true,
          mismatch: true,
          error: mismatchError.message,
          errorType: mismatchError.type,
          userByPhone: userByPhone ? { email: userByPhone.email, phone: userByPhone.phone } : null,
          userByEmail: userByEmail ? { email: userByEmail.email, phone: userByEmail.phone } : null,
        },
        { status: 400 }
      );
    }

    // If no mismatch, proceed with normal flow
    const user = userByPhone || userByEmail;

    // If user exists, get their tickets from tickets table by user_id
    type Ticket = {
      id: string;
      user_id: string;
      payment_intent_id: string | null;
      created_at: string;
    };
    let tickets: Ticket[] = [];
    if (user) {
      // Get tickets by user_id
      const { data: userTickets, error: ticketsError } = await supabase
        .from("tickets")
        .select("id, user_id, payment_intent_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!ticketsError && userTickets) {
        tickets = userTickets;
      }
      
      console.log("Found user:", user.email, "User ID:", user.id, "Tickets:", tickets.length);
    } else {
      console.log("No user found");
    }

    return NextResponse.json({
      exists: !!user,
      user: user || null,
      userId: user?.id || null,
      tickets: tickets,
      mismatch: false,
    });
  } catch (error: any) {
    console.error("Check existing user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check user" },
      { status: 500 }
    );
  }
}

