/**
 * Skills Search API Route for SkillCircle Platform
 * Handles searching and filtering of available skills
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Search parameters validation schema
const searchParamsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  experienceLevel: z.string().optional(),
  location: z.string().optional(),
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 12),
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

    // Parse and validate search parameters
    const { searchParams } = new URL(request.url);
    const params = searchParamsSchema.parse({
      query: searchParams.get("query"),
      category: searchParams.get("category"),
      experienceLevel: searchParams.get("experienceLevel"),
      location: searchParams.get("location"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const { query, category, experienceLevel, location, page, limit } = params;
    const skip = (page - 1) * limit;

    // Build search filters
    const where: any = {
      // Only show active and public skills
      isActive: true,
      isPublic: true,
      // Exclude current user's skills
      userId: { not: session.user.id },
      // Only show skills from users who allow their skills to be shown
      user: {
        isActive: true,
        isPrivate: false,
        showSkillsOffered: true,
      },
    };

    // Add text search filter
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    // Add category filter
    if (category && category !== "ALL") {
      where.category = category;
    }

    // Add experience level filter
    if (experienceLevel && experienceLevel !== "ALL") {
      where.experienceLevel = experienceLevel;
    }

    // Add location filter (if provided and user allows location sharing)
    if (location) {
      where.user.showLocation = true;
      where.user.location = {
        path: ["city"],
        string_contains: location,
      };
    }

    // Fetch skills with user information
    const [skills, totalCount] = await Promise.all([
      prisma.skillOffered.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              bio: true,
              location: true,
              showLocation: true,
              isVerified: true,
            },
          },
        },
        orderBy: [
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.skillOffered.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        skills,
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
    console.error("Skills search error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
