/**
 * Profile Setup API Route for SkillCircle Platform
 * Handles profile completion after Google OAuth
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSetupSchema } from "@/lib/validations/profile-setup";
import { z } from "zod";

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
    console.log("🚀 Profile setup API - Session user:", session.user.email);

    const validatedData = profileSetupSchema.parse(body);
    console.log("🚀 Profile setup API - Validation passed");

    // Start a transaction to update all related data
    const result = await prisma.$transaction(async (tx) => {
      console.log("🚀 Profile setup API - Starting transaction");
      // Update user profile
      const updatedUser = await tx.user.update({
        where: { email: session.user.email },
        data: {
          name: validatedData.name,
          bio: validatedData.bio || null,
          // Store location data in legacy format for now
          location: validatedData.location?.address
            ? {
              city: validatedData.location.address,
              isPublic: validatedData.privacy.showLocation,
              coordinates: validatedData.location.position || null,
            }
            : null,
          isSetupCompleted: true,
          // Privacy settings
          isPrivate: validatedData.privacy.isPrivate,
          showLocation: validatedData.privacy.showLocation,
          showRatings: validatedData.privacy.showRatings,
          showSkillsOffered: validatedData.privacy.showSkillsOffered,
          showSkillsWanted: validatedData.privacy.showSkillsWanted,
          allowDirectContact: validatedData.privacy.allowDirectContact,
        },
      });

      // Create availability record
      const availability = await tx.availability.create({
        data: {
          userId: updatedUser.id,
          daysOfWeek: validatedData.availability.daysOfWeek,
          timeSlots: validatedData.availability.timeSlots,
          sessionDuration: validatedData.availability.sessionDuration,
          timezone: validatedData.availability.timezone,
          isRecurring: validatedData.availability.isRecurring,
        },
      });

      // Create skills offered
      const skillsOffered = await Promise.all(
        validatedData.skillsOffered.map((skill) =>
          tx.skillOffered.create({
            data: {
              userId: updatedUser.id,
              title: skill.title,
              description: skill.description,
              category: skill.category,
              experienceLevel: skill.experienceLevel,
              yearsOfExperience: skill.yearsOfExperience || null,
              // Add required fields with defaults
              preferredFormat: [],
              availability: [],
              isActive: true,
              isPublic: true,
            },
          })
        )
      );

      // Create skills wanted
      const skillsWanted = await Promise.all(
        validatedData.skillsWanted.map((skill) =>
          tx.skillWanted.create({
            data: {
              userId: updatedUser.id,
              title: skill.title,
              description: skill.description,
              category: skill.category,
              currentLevel: skill.currentLevel || null,
              desiredLevel: skill.desiredLevel,
            },
          })
        )
      );

      return {
        user: updatedUser,
        availability,
        skillsOffered,
        skillsWanted,
      };
    });

    console.log("🚀 Profile setup API - Transaction completed successfully");
    console.log("🚀 Profile setup API - Updated user:", result.user.email, "isSetupCompleted:", result.user.isSetupCompleted);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Profile setup completed successfully!",
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
