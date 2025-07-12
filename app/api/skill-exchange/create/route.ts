/**
 * Skill Exchange Request Creation API Route for SkillCircle Platform
 * Handles creating new skill exchange requests
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Request validation schema
const createExchangeSchema = z.object({
  offeredSkillId: z.string().min(1, "Skill ID is required"),
  exchangeTitle: z.string().min(1, "Exchange title is required"),
  agreementTerms: z.string().min(1, "Agreement terms are required"),
  format: z.enum(["ONLINE_ONLY", "IN_PERSON_ONLY", "HYBRID"]),
  estimatedHours: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createExchangeSchema.parse(body);

    // Check if the skill exists and is available
    const offeredSkill = await prisma.skillOffered.findUnique({
      where: { 
        id: validatedData.offeredSkillId,
        isActive: true,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            isActive: true,
            isPrivate: true,
          },
        },
      },
    });

    if (!offeredSkill) {
      return NextResponse.json(
        { error: "Skill not found or not available" },
        { status: 404 }
      );
    }

    // Check if user is trying to request their own skill
    if (offeredSkill.user.id === session.user.id) {
      return NextResponse.json(
        { error: "You cannot request your own skill" },
        { status: 400 }
      );
    }

    // Check if user is active and teacher allows skill exchanges
    if (!offeredSkill.user.isActive || offeredSkill.user.isPrivate) {
      return NextResponse.json(
        { error: "This skill is not available for exchange" },
        { status: 400 }
      );
    }

    // Check for existing pending or accepted request
    const existingExchange = await prisma.skillExchange.findFirst({
      where: {
        learnerId: session.user.id,
        offeredSkillId: validatedData.offeredSkillId,
        status: {
          in: ["PENDING", "ACCEPTED", "IN_PROGRESS"],
        },
      },
    });

    if (existingExchange) {
      return NextResponse.json(
        { error: "You already have an active request for this skill" },
        { status: 400 }
      );
    }

    // Create the skill exchange request
    const skillExchange = await prisma.skillExchange.create({
      data: {
        teacherId: offeredSkill.user.id,
        learnerId: session.user.id,
        offeredSkillId: validatedData.offeredSkillId,
        exchangeTitle: validatedData.exchangeTitle,
        agreementTerms: validatedData.agreementTerms,
        format: validatedData.format,
        estimatedHours: validatedData.estimatedHours,
        status: "PENDING",
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        learner: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        offeredSkill: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            experienceLevel: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: skillExchange,
      message: "Skill exchange request created successfully!",
    });
  } catch (error) {
    console.error("Skill exchange creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
