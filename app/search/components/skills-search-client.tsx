"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Clock,
  MapPin,
  RotateCcw,
  Search,
  SearchX,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/utils/empty-state";
import { PaginationControls } from "@/components/utils/pagination-controls";
import {
  EXCHANGE_FORMAT_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  SKILL_CATEGORY_LABELS,
  formatEnumLabel,
} from "@/lib/skill-labels";
import { cn } from "@/lib/utils";

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
const ALL = "ALL";
const SEARCH_DEBOUNCE_MS = 400;

const SKILL_CATEGORIES = [
  { value: ALL, label: "All categories" },
  ...Object.entries(SKILL_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

const EXPERIENCE_LEVELS = [
  { value: ALL, label: "All levels" },
  ...Object.entries(EXPERIENCE_LEVEL_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

const LEVEL_STYLES: Record<string, string> = {
  BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INTERMEDIATE: "bg-sky-50 text-sky-700 border-sky-200",
  ADVANCED: "bg-violet-50 text-violet-700 border-violet-200",
  EXPERT: "bg-amber-50 text-amber-700 border-amber-200",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

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
    <div className="space-y-6">
      <Card className="py-4">
        <CardContent className="flex flex-col gap-3 px-4 lg:flex-row">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 lg:w-48" />
          <Skeleton className="h-11 lg:w-40" />
        </CardContent>
      </Card>
      <SkillGridSkeleton />
    </div>
  );
}

function SkillGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-14 w-full" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main search content component
function SkillsSearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initial state comes from the URL so searches are shareable
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("query") || ""
  );
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery.trim());
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get("category") || ALL
  );
  const [selectedLevel, setSelectedLevel] = useState(
    () => searchParams.get("experienceLevel") || ALL
  );
  const [currentPage, setCurrentPage] = useState(() =>
    Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
  );

  // Debounce typing so we don't hit the API on every keystroke
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed === debouncedQuery) return;

    const timeout = setTimeout(() => {
      setDebouncedQuery(trimmed);
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchQuery, debouncedQuery]);

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<SearchResponse>({
      queryKey: [
        "skills-search",
        debouncedQuery,
        selectedCategory,
        selectedLevel,
        currentPage,
      ],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("query", debouncedQuery);
        if (selectedCategory !== ALL) params.set("category", selectedCategory);
        if (selectedLevel !== ALL) params.set("experienceLevel", selectedLevel);
        params.set("page", currentPage.toString());
        params.set("limit", "12");

        const response = await fetch(`/api/skills/search?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }
        return response.json();
      },
      placeholderData: keepPreviousData,
    });

  // Keep the URL in sync with the active filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);
    if (selectedCategory !== ALL) params.set("category", selectedCategory);
    if (selectedLevel !== ALL) params.set("experienceLevel", selectedLevel);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newURL = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newURL, { scroll: false });
  }, [debouncedQuery, selectedCategory, selectedLevel, currentPage, pathname, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed === debouncedQuery) {
      refetch();
    } else {
      setDebouncedQuery(trimmed);
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCategory(ALL);
    setSelectedLevel(ALL);
    setCurrentPage(1);
  };

  const activeFilters = [
    debouncedQuery && {
      key: "query",
      label: `“${debouncedQuery}”`,
      onRemove: () => {
        setSearchQuery("");
        setDebouncedQuery("");
        setCurrentPage(1);
      },
    },
    selectedCategory !== ALL && {
      key: "category",
      label: formatEnumLabel(selectedCategory, SKILL_CATEGORY_LABELS),
      onRemove: () => handleCategoryChange(ALL),
    },
    selectedLevel !== ALL && {
      key: "level",
      label: formatEnumLabel(selectedLevel, EXPERIENCE_LEVEL_LABELS),
      onRemove: () => handleLevelChange(ALL),
    },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

  const pagination = data?.data.pagination;
  const skills = data?.data.skills ?? [];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="z-10 lg:sticky lg:top-20 border-border/70 bg-card/90 py-4 shadow-md backdrop-blur">
        <CardContent className="space-y-3 px-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 lg:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                aria-label="Search skills"
                placeholder="Search for skills, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 lg:flex">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger
                  aria-label="Category"
                  className="h-11! w-full lg:w-48"
                >
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={handleLevelChange}>
                <SelectTrigger
                  aria-label="Experience level"
                  className="h-11! w-full lg:w-40"
                >
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 lg:px-8"
              isLoading={isFetching}
              leftIcon={<Search />}
            >
              Search
            </Button>
          </form>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Filters:</span>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="gap-1 rounded-full py-1 pl-2.5 pr-1"
                >
                  {filter.label}
                  <button
                    type="button"
                    onClick={filter.onRemove}
                    className="rounded-full p-0.5 hover:bg-background"
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="link"
                size="sm"
                className="h-auto px-1 text-xs"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <SkillGridSkeleton />
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          tone="error"
          title="Something went wrong"
          description="We couldn't load skills right now. Please try again."
          action={
            <Button onClick={() => refetch()} leftIcon={<RotateCcw />}>
              Try again
            </Button>
          }
        />
      ) : skills.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No skills found"
          description="Try a different keyword or loosen your filters to see more results."
          action={
            activeFilters.length > 0 ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {pagination?.totalCount}
              </span>{" "}
              skill{pagination?.totalCount === 1 ? "" : "s"} found
            </p>
            {pagination && pagination.totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
            )}
          </div>

          {/* Skills Grid */}
          <div
            className={cn(
              "grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3",
              isFetching && "opacity-60"
            )}
          >
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>

          {pagination && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
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

  const getUserLocation = (user: SkillUser) => {
    if (!user.showLocation || !user.location) return null;
    if (typeof user.location === "object" && user.location.city) {
      return user.location.city as string;
    }
    return "Online";
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

      toast.success("Request sent!", {
        description: `${skill.user.name} will be notified about your request.`,
      });
      setShowRequestModal(false);
      router.push("/request");
    } catch (error) {
      console.error("Error creating skill exchange request:", error);
      toast.error("Couldn't send request", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to create request. Please try again.",
      });
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const location = getUserLocation(skill.user);

  return (
    <Card className="group gap-0 border-border/70 py-0 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex flex-1 flex-col gap-4 px-5 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className="rounded-full bg-accent text-accent-foreground"
          >
            {formatEnumLabel(skill.category, SKILL_CATEGORY_LABELS)}
          </Badge>
          {location && (
            <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              {location}
            </span>
          )}
        </div>

        {/* Skill Title & Description */}
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
            {skill.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {skill.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn("rounded-full", LEVEL_STYLES[skill.experienceLevel])}
          >
            <Sparkles />
            {formatEnumLabel(skill.experienceLevel, EXPERIENCE_LEVEL_LABELS)}
          </Badge>
          {!!skill.yearsOfExperience && (
            <Badge variant="outline" className="rounded-full text-muted-foreground">
              <Clock />
              {skill.yearsOfExperience} yr{skill.yearsOfExperience === 1 ? "" : "s"}
            </Badge>
          )}
        </div>

        {/* Teacher Info */}
        <div className="mt-auto flex items-center gap-3 border-t pt-4">
          <Avatar className="size-10">
            <AvatarImage src={skill.user.profileImage} alt={skill.user.name} />
            <AvatarFallback className="bg-muted text-xs font-semibold">
              {getInitials(skill.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="flex items-center gap-1 truncate text-sm font-medium">
              {skill.user.name}
              {skill.user.isVerified && (
                <BadgeCheck
                  className="size-4 shrink-0 text-primary"
                  aria-label="Verified"
                />
              )}
            </p>
            {skill.user.bio && (
              <p className="truncate text-xs text-muted-foreground">
                {skill.user.bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-4">
        <Button
          fullWidth
          onClick={() => setShowRequestModal(true)}
          rightIcon={<ArrowRight />}
        >
          Connect & Learn
        </Button>
      </CardFooter>

      <SkillExchangeRequestModal
        open={showRequestModal}
        skill={skill}
        onSubmit={createSkillExchangeRequest}
        onClose={() => setShowRequestModal(false)}
        isLoading={isCreatingRequest}
      />
    </Card>
  );
}

// Skill Exchange Request Modal Component
function SkillExchangeRequestModal({
  open,
  skill,
  onSubmit,
  onClose,
  isLoading,
}: {
  open: boolean;
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
  const [errors, setErrors] = useState<{
    exchangeTitle?: string;
    agreementTerms?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!formData.exchangeTitle.trim())
      nextErrors.exchangeTitle = "Please add a title for this exchange";
    if (!formData.agreementTerms.trim())
      nextErrors.agreementTerms =
        "Tell the teacher what you'd like to learn and what you offer";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

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
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && !isLoading && onClose()}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request skill exchange</DialogTitle>
          <DialogDescription>
            Introduce yourself and propose how you&apos;d like to swap skills.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <Avatar className="size-10">
            <AvatarImage src={skill.user.profileImage} alt={skill.user.name} />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(skill.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{skill.title}</p>
            <p className="truncate text-sm text-muted-foreground">
              with {skill.user.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor={`exchange-title-${skill.id}`}>
              Exchange title <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`exchange-title-${skill.id}`}
              value={formData.exchangeTitle}
              onChange={(e) =>
                setFormData({ ...formData, exchangeTitle: e.target.value })
              }
              placeholder="e.g., Learn Python Programming"
              aria-invalid={!!errors.exchangeTitle}
              disabled={isLoading}
            />
            {errors.exchangeTitle && (
              <p className="text-xs text-destructive">{errors.exchangeTitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`agreement-terms-${skill.id}`}>
              Your proposal <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`agreement-terms-${skill.id}`}
              value={formData.agreementTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreementTerms: e.target.value })
              }
              rows={4}
              placeholder="Describe what you'd like to learn and what you can offer in return..."
              aria-invalid={!!errors.agreementTerms}
              disabled={isLoading}
            />
            {errors.agreementTerms && (
              <p className="text-xs text-destructive">{errors.agreementTerms}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred format</Label>
              <Select
                value={formData.format}
                onValueChange={(value) =>
                  setFormData({ ...formData, format: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXCHANGE_FORMAT_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`estimated-hours-${skill.id}`}>
                Estimated hours{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={`estimated-hours-${skill.id}`}
                type="number"
                value={formData.estimatedHours}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedHours: e.target.value })
                }
                placeholder="e.g., 10"
                min="1"
                max="100"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} leftIcon={<Send />}>
              {isLoading ? "Sending..." : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
