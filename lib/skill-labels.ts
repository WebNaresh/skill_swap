/**
 * Shared display labels for skill-related enums used across the UI
 */

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  TECHNOLOGY: "Technology",
  BUSINESS: "Business",
  CREATIVE: "Creative Arts",
  LANGUAGES: "Languages",
  MUSIC: "Music",
  SPORTS: "Sports & Fitness",
  COOKING: "Cooking & Food",
  CRAFTS: "Crafts & DIY",
  HEALTH_WELLNESS: "Health & Wellness",
  EDUCATION: "Education",
  AUTOMOTIVE: "Automotive",
  HOME_GARDEN: "Home & Garden",
  OTHER: "Other",
};

export const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

export const EXCHANGE_FORMAT_LABELS: Record<string, string> = {
  ONLINE_ONLY: "Online",
  IN_PERSON_ONLY: "In person",
  HYBRID: "Hybrid",
};

export const EXCHANGE_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Falls back to a title-cased version of the raw enum value
export function formatEnumLabel(
  value: string,
  labels: Record<string, string>
): string {
  return (
    labels[value] ??
    value
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}
