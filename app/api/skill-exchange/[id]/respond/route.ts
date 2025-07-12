/**
 * Skill Exchange Request Response API Route for SkillCircle Platform
 * Handles accepting/rejecting skill exchange requests by teachers
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Request validation schema
const respondToRequestSchema = z.object({
  action: z.enum(["accept", "reject"], {
    required_error: "Action is required",
    invalid_type_error: "Action must be either 'accept' or 'reject'",
  }),
  responseMessage: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Await and validate request ID
    const { id: requestId } = await params;
    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = respondToRequestSchema.parse(body);

    // Find the skill exchange request
    const skillExchange = await prisma.skillExchange.findUnique({
      where: { id: requestId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        offeredSkill: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!skillExchange) {
      return NextResponse.json(
        { error: "Skill exchange request not found" },
        { status: 404 }
      );
    }

    // Check authorization - only the teacher can respond to the request
    if (skillExchange.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to respond to this request" },
        { status: 403 }
      );
    }

    // Check if request is in pending status
    if (skillExchange.status !== "PENDING") {
      return NextResponse.json(
        { error: `Cannot respond to request with status: ${skillExchange.status}` },
        { status: 400 }
      );
    }

    // Determine new status based on action
    const newStatus = validatedData.action === "accept" ? "ACCEPTED" : "CANCELLED";

    // Update the skill exchange request
    const updatedExchange = await prisma.skillExchange.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        // Store response message in progressNotes field for now
        progressNotes: validatedData.responseMessage || `Request ${validatedData.action}ed by teacher`,
        // If accepted, set scheduled start date to current date
        ...(validatedData.action === "accept" && {
          scheduledStart: new Date(),
        }),
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            isVerified: true,
          },
        },
        learner: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            isVerified: true,
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
        wantedSkill: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            desiredLevel: true,
          },
        },
      },
    });

    // Log the action for audit purposes
    console.log(
      `Skill exchange request ${requestId} ${validatedData.action}ed by teacher ${session.user.id} (${session.user.name})`
    );

    return NextResponse.json({
      success: true,
      data: {
        ...updatedExchange,
        userRole: "teacher", // Add user role for consistency
      },
      message: `Request ${validatedData.action}ed successfully!`,
    });
  } catch (error) {
    console.error("Skill exchange response error:", error);

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
