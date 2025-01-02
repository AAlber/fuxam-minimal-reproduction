import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import "server-only";

export async function POST() {
  try {
    // Import required functions and prisma
    const { userId } = auth();

      if (!userId) {
        console.log("Test user not found");
      return NextResponse.json(
        { message: "Test user not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        userId,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to get layer path" + (error as Error).message },
      { status: 500 },
    );
  }
}
