import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // We will actually use it now

export async function POST() {
  try {
    // 1. Access the cookie store
    const cookieStore = await cookies();

    // 2. Delete the token directly
    cookieStore.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // This expires the cookie immediately
      path: "/",
    });

    return NextResponse.json({ 
      message: "SESSION_TERMINATED",
      status: "UPLINK_CLOSED" 
    }, { status: 200 });
    
  } catch (err) {
    return NextResponse.json({ error: "LOGOUT_FAILURE" }, { status: 500 });
  }
}