"use client";

/**
 * Skills Search Client Component for SkillCircle Platform
 * Handles interactive search, filtering, and display of skills
 */

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Filter, MapPin, Clock, User, Star } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

// Types
interface SkillUser {
  id: string;
  name: string;
  profileImage: string;
  bio?: string;
  location?: any;
  showLocation: boolean;
  isVerified: boolean;
}

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  experienceLevel: string;
  yearsOfExperience?: number;
  preferredFormat: string[];
  availability: string[];
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  user: SkillUser;
}

interface SearchResponse {
  success: boolean;
  data: {
    skills: Skill[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
  };
}

// Constants
const SKILL_CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "BUSINESS", label: "Business" },
  { value: "CREATIVE", label: "Creative Arts" },
  { value: "LANGUAGES", label: "Languages" },
  { value: "MUSIC", label: "Music" },
  { value: "SPORTS", label: "Sports & Fitness" },
  { value: "COOKING", label: "Cooking & Food" },
  { value: "CRAFTS", label: "Crafts & DIY" },
  { value: "HEALTH_WELLNESS", label: "Health & Wellness" },
  { value: "EDUCATION", label: "Education" },
  { value: "AUTOMOTIVE", label: "Automotive" },
  { value: "HOME_GARDEN", label: "Home & Garden" },
  { value: "OTHER", label: "Other" },
];

const EXPERIENCE_LEVELS = [
  { value: "ALL", label: "All Levels" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
];

// Wrapper component to handle Suspense boundary
export function SkillsSearchClient() {
  return (
    <Suspense fallback={<SearchLoadingFallback />}>
      <SkillsSearchContent />
    </Suspense>
  );
}

// Loading fallback component
function SearchLoadingFallback() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-16 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main search content component
function SkillsSearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state with proper hydration handling
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    setSearchQuery(searchParams.get("query") || "");
    setSelectedCategory(searchParams.get("category") || "ALL");
    setSelectedLevel(searchParams.get("experienceLevel") || "ALL");
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  // Fetch skills data - only run when client is ready
  const { data, isLoading, error, refetch } = useQuery<SearchResponse>({
    queryKey: [
      "skills-search",
      searchQuery,
      selectedCategory,
      selectedLevel,
      currentPage,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim())
        params.set("query", searchQuery.trim());
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      if (selectedLevel !== "ALL") params.set("experienceLevel", selectedLevel);
      params.set("page", currentPage.toString());
      params.set("limit", "12");

      const response = await fetch(`/api/skills/search?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }
      return response.json();
    },
    enabled: isClient, // Only run query when client is ready
  });

  // Update URL when search parameters change
  const updateURL = useCallback(() => {
    if (!isClient) return; // Only update URL when client is ready

    const params = new URLSearchParams();
    if (searchQuery && searchQuery.trim())
      params.set("query", searchQuery.trim());
    if (selectedCategory !== "ALL") params.set("category", selectedCategory);
    if (selectedLevel !== "ALL") params.set("experienceLevel", selectedLevel);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newURL = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newURL);
  }, [
    isClient,
    searchQuery,
    selectedCategory,
    selectedLevel,
    currentPage,
    pathname,
    router,
  ]);

  // Update URL when search parameters change
  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format category display name
  const getCategoryLabel = (category: string) => {
    return (
      SKILL_CATEGORIES.find((cat) => cat.value === category)?.label || category
    );
  };

  // Format experience level display name
  const getExperienceLevelLabel = (level: string) => {
    return EXPERIENCE_LEVELS.find((lvl) => lvl.value === level)?.label || level;
  };

  // Get user location display
  const getUserLocation = (user: SkillUser) => {
    if (!user.showLocation || !user.location) return "Location not shared";
    if (typeof user.location === "object" && user.location.city) {
      return user.location.city;
    }
    return "Online";
  };

  // Show loading state until client is ready
  if (!isClient) {
    return <SearchLoadingFallback />;
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for skills, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="px-8 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Searching for skills...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">
            Failed to load skills. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : data?.data.skills.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No skills found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or browse all available skills.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setSelectedLevel("ALL");
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {data?.data.pagination.totalCount} Skills Found
            </h2>
            <p className="text-gray-600">
              Page {data?.data.pagination.currentPage} of{" "}
              {data?.data.pagination.totalPages}
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>

          {/* Pagination */}
          {data?.data.pagination.totalPages &&
            data.data.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!data.data.pagination.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from(
                  { length: data.data.pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      page === currentPage
                        ? "bg-sky-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!data.data.pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
}

// Skill Card Component
function SkillCard({ skill }: { skill: Skill }) {
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const router = useRouter();
  const getCategoryLabel = (category: string) => {
    const SKILL_CATEGORIES = [
      { value: "TECHNOLOGY", label: "Technology" },
      { value: "BUSINESS", label: "Business" },
      { value: "CREATIVE", label: "Creative Arts" },
      { value: "LANGUAGES", label: "Languages" },
      { value: "MUSIC", label: "Music" },
      { value: "SPORTS", label: "Sports & Fitness" },
      { value: "COOKING", label: "Cooking & Food" },
      { value: "CRAFTS", label: "Crafts & DIY" },
      { value: "HEALTH_WELLNESS", label: "Health & Wellness" },
      { value: "EDUCATION", label: "Education" },
      { value: "AUTOMOTIVE", label: "Automotive" },
      { value: "HOME_GARDEN", label: "Home & Garden" },
      { value: "OTHER", label: "Other" },
    ];
    return (
      SKILL_CATEGORIES.find((cat) => cat.value === category)?.label || category
    );
  };

  const getExperienceLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      BEGINNER: "Beginner",
      INTERMEDIATE: "Intermediate",
      ADVANCED: "Advanced",
      EXPERT: "Expert",
    };
    return levels[level] || level;
  };

  const getUserLocation = (user: SkillUser) => {
    if (!user.showLocation || !user.location) return "Location not shared";
    if (typeof user.location === "object" && user.location.city) {
      return user.location.city;
    }
    return "Online";
  };

  // Handle skill exchange request creation
  const handleConnectRequest = () => {
    setShowRequestModal(true);
  };

  const createSkillExchangeRequest = async (requestData: {
    exchangeTitle: string;
    agreementTerms: string;
    format: string;
    estimatedHours?: number;
  }) => {
    setIsCreatingRequest(true);
    try {
      const response = await fetch("/api/skill-exchange/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offeredSkillId: skill.id,
          ...requestData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create request");
      }

      // Show success message
      alert("Skill exchange request sent successfully!");

      // Redirect to requests page
      router.push("/request");
    } catch (error) {
      console.error("Error creating skill exchange request:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create request. Please try again."
      );
    } finally {
      setIsCreatingRequest(false);
      setShowRequestModal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full">
          {getCategoryLabel(skill.category)}
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {getUserLocation(skill.user)}
        </span>
      </div>

      {/* Skill Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {skill.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-3">{skill.description}</p>

      {/* Experience Level */}
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-4 w-4 text-yellow-500" />
        <span className="text-sm text-gray-600">
          {getExperienceLevelLabel(skill.experienceLevel)}
          {skill.yearsOfExperience && ` • ${skill.yearsOfExperience} years`}
        </span>
      </div>

      {/* Teacher Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Image
            src={skill.user.profileImage}
            alt={skill.user.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          {skill.user.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{skill.user.name}</p>
          {skill.user.bio && (
            <p className="text-sm text-gray-500 line-clamp-1">
              {skill.user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleConnectRequest}
        disabled={isCreatingRequest}
        className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreatingRequest ? "Creating Request..." : "Connect & Learn"}
      </button>

      {/* Request Modal */}
      {showRequestModal && (
        <SkillExchangeRequestModal
          skill={skill}
          onSubmit={createSkillExchangeRequest}
          onClose={() => setShowRequestModal(false)}
          isLoading={isCreatingRequest}
        />
      )}
    </div>
  );
}

// Skill Exchange Request Modal Component
function SkillExchangeRequestModal({
  skill,
  onSubmit,
  onClose,
  isLoading,
}: {
  skill: Skill;
  onSubmit: (data: {
    exchangeTitle: string;
    agreementTerms: string;
    format: string;
    estimatedHours?: number;
  }) => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    exchangeTitle: `Learn ${skill.title}`,
    agreementTerms: "",
    format: "ONLINE_ONLY",
    estimatedHours: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.exchangeTitle.trim() || !formData.agreementTerms.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      exchangeTitle: formData.exchangeTitle.trim(),
      agreementTerms: formData.agreementTerms.trim(),
      format: formData.format,
      estimatedHours: formData.estimatedHours
        ? parseInt(formData.estimatedHours)
        : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Request Skill Exchange
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{skill.title}</h4>
            <p className="text-sm text-gray-600">by {skill.user.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exchange Title *
              </label>
              <input
                type="text"
                value={formData.exchangeTitle}
                onChange={(e) =>
                  setFormData({ ...formData, exchangeTitle: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., Learn Python Programming"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agreement Terms *
              </label>
              <textarea
                value={formData.agreementTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreementTerms: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                rows={3}
                placeholder="Describe what you'd like to learn and what you can offer in return..."
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Format
              </label>
              <select
                value={formData.format}
                onChange={(e) =>
                  setFormData({ ...formData, format: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={isLoading}
              >
                <option value="ONLINE_ONLY">Online Only</option>
                <option value="IN_PERSON_ONLY">In Person Only</option>
                <option value="HYBRID">Hybrid (Online + In Person)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Hours (Optional)
              </label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedHours: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g., 10"
                min="1"
                max="100"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
