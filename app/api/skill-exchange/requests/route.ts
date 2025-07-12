/**
 * Skill Exchange Requests API Route for SkillCircle Platform
 * Handles fetching skill exchange requests for authenticated users
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Query parameters validation schema
const requestsParamsSchema = z.object({
  type: z.enum(["incoming", "outgoing", "all"]).nullable().optional().default("all"),
  status: z.enum(["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "all"]).nullable().optional().default("all"),
  page: z.string().nullable().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().nullable().optional().transform((val) => val ? parseInt(val, 10) : 10),
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const params = requestsParamsSchema.parse({
      type: searchParams.get("type") || "all",
      status: searchParams.get("status") || "all",
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const { type, status, page, limit } = params;
    const skip = (page - 1) * limit;

    // Build where clause based on request type
    const where: any = {};

    if (type === "incoming") {
      // Requests where current user is the teacher
      where.teacherId = session.user.id;
    } else if (type === "outgoing") {
      // Requests where current user is the learner
      where.learnerId = session.user.id;
    } else {
      // All requests involving the current user
      where.OR = [
        { teacherId: session.user.id },
        { learnerId: session.user.id },
      ];
    }

    // Add status filter
    if (status && status !== "all") {
      where.status = status;
    }

    // Fetch skill exchange requests with related data
    const [exchanges, totalCount] = await Promise.all([
      prisma.skillExchange.findMany({
        where,
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
        orderBy: [
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.skillExchange.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Add user role information to each exchange
    const exchangesWithRole = exchanges.map((exchange) => ({
      ...exchange,
      userRole: exchange.teacherId === session.user.id ? "teacher" : "learner",
    }));

    return NextResponse.json({
      success: true,
      data: {
        exchanges: exchangesWithRole,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("Skill exchange requests fetch error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
