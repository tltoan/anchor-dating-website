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

    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save user to wishlist (before payment)
    // Try with has_ticket first, fallback without it if column doesn't exist
    let data, error;
    
    const insertData: any = {
      name,
      email,
      phone,
      created_at: new Date().toISOString(),
    };

    // Normalize phone number for comparison
    const normalizePhone = (phone: string) => {
      if (!phone) return "";
      return phone.replace(/[\s\-\(\)\+]/g, "");
    };

    const normalizedPhone = normalizePhone(phone);

    // Check if wishlist entry already exists by phone number (has_ticket: false)
    const { data: allEntries } = await supabase
      .from("waitlist")
      .select("*");

    const existingWishlistEntry = allEntries?.find((entry) => {
      const entryPhone = normalizePhone(entry.phone || "");
      return entryPhone === normalizedPhone && entry.has_ticket === false;
    });

    // If wishlist entry already exists, don't create another one
    if (existingWishlistEntry) {
      console.log("Wishlist entry already exists for phone:", phone);
      return NextResponse.json({ 
        success: true, 
        data: [existingWishlistEntry],
        message: "Wishlist entry already exists"
      });
    }

    // Check if email already exists (for different user with same email)
    const { data: existingByEmail, error: checkError } = await supabase
      .from("waitlist")
      .select("id, email, phone")
      .eq("email", email)
      .maybeSingle();

    // If email exists for a different phone number, return error
    if (existingByEmail && !checkError) {
      const existingPhone = normalizePhone(existingByEmail.phone || "");
      if (existingPhone !== normalizedPhone) {
        return NextResponse.json(
          {
            error: "This email is already registered. Please use a different email address.",
            code: "EMAIL_EXISTS",
          },
          { status: 400 }
        );
      }
    }

    // Try to include has_ticket if column exists
    const result = await supabase
      .from("waitlist")
      .insert({
        ...insertData,
        has_ticket: false,
      })
      .select();

    data = result.data;
    error = result.error;

    // If error is about missing column, try without has_ticket
    if (error && (error.message?.includes("has_ticket") || error.message?.includes("column") || error.code === "PGRST204")) {
      console.warn("has_ticket column not found, saving without it. Please run migration.");
      const fallbackResult = await supabase
        .from("waitlist")
        .insert(insertData)
        .select();
      
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    // If error is about unique constraint, email already exists
    if (error && (error.code === "23505" || error.message?.includes("unique") || error.message?.includes("duplicate"))) {
      return NextResponse.json(
        {
          error: "Email already exists. Please use a different email address.",
          code: "EMAIL_EXISTS",
        },
        { status: 400 }
      );
    }

    if (error) {
      console.error("Supabase error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          error: "Failed to save user to wishlist",
          details: error.message || error.code || "Unknown error",
          code: error.code,
          hint: error.message?.includes("has_ticket") || error.message?.includes("column") 
            ? "Please ensure you have run the database migration (supabase-migration.sql)"
            : "Check your Supabase configuration and table structure"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Save user to wishlist error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save user" },
      { status: 500 }
    );
  }
}

