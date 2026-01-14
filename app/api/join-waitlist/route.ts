import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    // Check if user already exists in waitlist
    const { data: existingUser, error: checkError } = await supabase
      .from("waitlist")
      .select("*")
      .or(`email.eq.${email},phone.eq.${normalizedPhone}`)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing user:", checkError);
      return NextResponse.json(
        { error: "Failed to check existing user" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          message: "You're already on the waitlist!",
          alreadyExists: true
        },
        { status: 200 }
      );
    }

    // Insert new user into waitlist
    const { data, error } = await supabase
      .from("waitlist")
      .insert([
        {
          name,
          email,
          phone: normalizedPhone,
          has_ticket: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting into waitlist:", error);
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully joined the waitlist!",
        userId: data.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in join-waitlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
