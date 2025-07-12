/**
 * Profile Setup API Route for SkillCircle Platform
 * Handles profile completion after Google OAuth
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for profile setup
const profileSetupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  bio: z.string().max(500, "Bio is too long").optional(),
  location: z.string().max(100, "Location is too long").optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = profileSetupSchema.parse(body);

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: validatedData.name,
        bio: validatedData.bio || null,
        location: validatedData.location
          ? {
              city: validatedData.location,
              isPublic: true,
            }
          : null,
        isSetupCompleted: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        location: true,
        isSetupCompleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile setup error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
