"use client";

/**
 * Skill Exchange Requests Client Component for SkillCircle Platform
 * Handles displaying and managing skill exchange requests
 */

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDashed,
  Clock,
  Hourglass,
  Inbox,
  Layers,
  MonitorSmartphone,
  RotateCcw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/utils/empty-state";
import { PaginationControls } from "@/components/utils/pagination-controls";
import {
  EXCHANGE_FORMAT_LABELS,
  EXCHANGE_STATUS_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  SKILL_CATEGORY_LABELS,
  formatEnumLabel,
} from "@/lib/skill-labels";
import { cn } from "@/lib/utils";

// Types
interface SkillExchangeUser {
  id: string;
  name: string;
  profileImage: string;
  isVerified: boolean;
}

interface OfferedSkill {
  id: string;
  title: string;
  description: string;
  category: string;
  experienceLevel: string;
}

interface WantedSkill {
  id: string;
  title: string;
  description: string;
  category: string;
  desiredLevel: string;
}

interface SkillExchange {
  id: string;
  exchangeTitle: string;
  agreementTerms: string;
  status: string;
  format: string;
  estimatedHours?: number;
  scheduledStart?: string;
  actualStart?: string;
  completedAt?: string;
  progressNotes?: string;
  createdAt: string;
  updatedAt: string;
  teacher: SkillExchangeUser;
  learner: SkillExchangeUser;
  offeredSkill: OfferedSkill;
  wantedSkill?: WantedSkill;
  userRole: "teacher" | "learner";
}

interface RequestsResponse {
  success: boolean;
  data: {
    exchanges: SkillExchange[];
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
const REQUEST_TYPES = [
  { value: "all", label: "All", icon: Layers },
  { value: "incoming", label: "Teaching", icon: ArrowDownLeft },
  { value: "outgoing", label: "Learning", icon: ArrowUpRight },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...Object.entries(EXCHANGE_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

const STATUS_STYLES: Record<
  string,
  { className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  PENDING: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Hourglass,
  },
  ACCEPTED: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  IN_PROGRESS: {
    className: "border-sky-200 bg-sky-50 text-sky-700",
    icon: CircleDashed,
  },
  COMPLETED: {
    className: "border-green-200 bg-green-50 text-green-700",
    icon: BadgeCheck,
  },
  CANCELLED: {
    className: "border-red-200 bg-red-50 text-red-700",
    icon: XCircle,
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Wrapper component to handle Suspense boundary
export function SkillExchangeRequestsClient() {
  return (
    <Suspense fallback={<RequestsLoadingFallback />}>
      <SkillExchangeRequestsContent />
    </Suspense>
  );
}

// Loading fallback component
function RequestsLoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-80" />
        <Skeleton className="h-10 w-full sm:w-44" />
      </div>
      <RequestListSkeleton />
    </div>
  );
}

function RequestListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main requests content component
function SkillExchangeRequestsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initial state comes from the URL so filtered views are shareable
  const [requestType, setRequestType] = useState(
    () => searchParams.get("type") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") || "all"
  );
  const [currentPage, setCurrentPage] = useState(() =>
    Math.max(1, parseInt(searchParams.get("page") || "1") || 1)
  );

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<RequestsResponse>({
      queryKey: [
        "skill-exchange-requests",
        requestType,
        statusFilter,
        currentPage,
      ],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (requestType !== "all") params.set("type", requestType);
        if (statusFilter !== "all") params.set("status", statusFilter);
        params.set("page", currentPage.toString());
        params.set("limit", "10");

        const response = await fetch(`/api/skill-exchange/requests?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        return response.json();
      },
      placeholderData: keepPreviousData,
    });

  // Keep the URL in sync with the active filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (requestType !== "all") params.set("type", requestType);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newURL = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newURL, { scroll: false });
  }, [requestType, statusFilter, currentPage, pathname, router]);

  const handleTypeChange = (type: string) => {
    setRequestType(type);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exchanges = data?.data.exchanges ?? [];
  const pagination = data?.data.pagination;

  const emptyDescription =
    statusFilter !== "all"
      ? `You don't have any ${formatEnumLabel(
          statusFilter,
          EXCHANGE_STATUS_LABELS
        ).toLowerCase()} requests here.`
      : requestType === "incoming"
      ? "Nobody has asked to learn from you yet. Make sure your skills are public!"
      : requestType === "outgoing"
      ? "You haven't sent any requests yet. Find someone to learn from."
      : "Start by discovering skills you'd like to learn from the community.";

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={requestType} onValueChange={handleTypeChange}>
          <TabsList className="h-10 w-full sm:w-auto">
            {REQUEST_TYPES.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="px-4">
                <Icon />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger
            aria-label="Filter by status"
            className="h-10! w-full bg-card sm:w-44"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading ? (
        <RequestListSkeleton />
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          tone="error"
          title="Something went wrong"
          description="We couldn't load your requests. Please try again."
          action={
            <Button onClick={() => refetch()} leftIcon={<RotateCcw />}>
              Try again
            </Button>
          }
        />
      ) : exchanges.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests found"
          description={emptyDescription}
          action={
            <Button asChild>
              <Link href="/search">
                <Search />
                Browse skills
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {pagination?.totalCount}
            </span>{" "}
            request{pagination?.totalCount === 1 ? "" : "s"}
            {pagination && pagination.totalPages > 1 && (
              <>
                {" "}
                · Page {pagination.currentPage} of {pagination.totalPages}
              </>
            )}
          </p>

          <div
            className={cn(
              "space-y-4 transition-opacity",
              isFetching && "opacity-60"
            )}
          >
            {exchanges.map((exchange) => (
              <SkillExchangeCard key={exchange.id} exchange={exchange} />
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

// Skill Exchange Card Component
function SkillExchangeCard({ exchange }: { exchange: SkillExchange }) {
  const [responseAction, setResponseAction] = useState<
    "accept" | "reject" | null
  >(null);
  const queryClient = useQueryClient();

  // Mutation for responding to skill exchange requests
  const respondMutation = useMutation({
    mutationFn: async (data: {
      action: "accept" | "reject";
      responseMessage?: string;
    }) => {
      const response = await fetch(
        `/api/skill-exchange/${exchange.id}/respond`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to respond to request");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["skill-exchange-requests"] });

      const accepted = data.data.status === "ACCEPTED";
      toast.success(accepted ? "Request accepted" : "Request declined", {
        description: accepted
          ? `${exchange.learner.name} will be notified so you can start coordinating.`
          : `${exchange.learner.name} will be notified of your decision.`,
      });

      setResponseAction(null);
    },
    onError: (error) => {
      console.error("Error responding to request:", error);
      toast.error("Couldn't update request", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to respond to request. Please try again.",
      });
    },
  });

  const isTeaching = exchange.userRole === "teacher";
  const otherUser = isTeaching ? exchange.learner : exchange.teacher;
  const status = STATUS_STYLES[exchange.status] ?? {
    className: "border-border bg-muted text-muted-foreground",
    icon: Clock,
  };
  const StatusIcon = status.icon;
  const canRespond = isTeaching && exchange.status === "PENDING";

  return (
    <Card
      className={cn(
        "gap-5 border-border/70 transition-shadow hover:shadow-md",
        canRespond && "border-l-4 border-l-amber-400"
      )}
    >
      <CardContent className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={otherUser.profileImage} alt={otherUser.name} />
              <AvatarFallback className="bg-muted font-semibold">
                {getInitials(otherUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold">
                {exchange.exchangeTitle}
              </h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                {isTeaching ? "Teaching" : "Learning from"}{" "}
                <span className="font-medium text-foreground">
                  {otherUser.name}
                </span>
                {otherUser.isVerified && (
                  <BadgeCheck
                    className="size-4 text-primary"
                    aria-label="Verified"
                  />
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "rounded-full",
                isTeaching
                  ? "border-violet-200 bg-violet-50 text-violet-700"
                  : "border-sky-200 bg-sky-50 text-sky-700"
              )}
            >
              {isTeaching ? <ArrowDownLeft /> : <ArrowUpRight />}
              {isTeaching ? "Incoming" : "Outgoing"}
            </Badge>
            <Badge
              variant="outline"
              className={cn("rounded-full", status.className)}
            >
              <StatusIcon />
              {formatEnumLabel(exchange.status, EXCHANGE_STATUS_LABELS)}
            </Badge>
          </div>
        </div>

        {/* Skill Information */}
        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <span className="font-medium">{exchange.offeredSkill.title}</span>
            <Badge variant="secondary" className="rounded-full">
              {formatEnumLabel(
                exchange.offeredSkill.category,
                SKILL_CATEGORY_LABELS
              )}
            </Badge>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {exchange.offeredSkill.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="size-3.5" />
              {formatEnumLabel(
                exchange.offeredSkill.experienceLevel,
                EXPERIENCE_LEVEL_LABELS
              )}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MonitorSmartphone className="size-3.5" />
              {formatEnumLabel(exchange.format, EXCHANGE_FORMAT_LABELS)}
            </span>
            {!!exchange.estimatedHours && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {exchange.estimatedHours} hour
                {exchange.estimatedHours === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>

        {/* Agreement Terms */}
        <div>
          <h4 className="mb-1 text-sm font-medium">Proposal</h4>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {exchange.agreementTerms}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              Sent {formatDate(exchange.createdAt)}
            </span>
            {exchange.scheduledStart && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Scheduled {formatDate(exchange.scheduledStart)}
              </span>
            )}
          </div>

          {canRespond && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive sm:flex-none"
                onClick={() => setResponseAction("reject")}
                disabled={respondMutation.isPending}
                leftIcon={<X />}
              >
                Decline
              </Button>
              <Button
                variant="success"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => setResponseAction("accept")}
                disabled={respondMutation.isPending}
                leftIcon={<Check />}
              >
                Accept
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {responseAction && (
        <ResponseModal
          action={responseAction}
          exchange={exchange}
          onSubmit={(responseMessage) =>
            respondMutation.mutate({ action: responseAction, responseMessage })
          }
          onClose={() => setResponseAction(null)}
          isLoading={respondMutation.isPending}
        />
      )}
    </Card>
  );
}

// Response Modal Component
function ResponseModal({
  action,
  exchange,
  onSubmit,
  onClose,
  isLoading,
}: {
  action: "accept" | "reject";
  exchange: SkillExchange;
  onSubmit: (responseMessage?: string) => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(responseMessage.trim() || undefined);
  };

  const isAccept = action === "accept";

  return (
    <Dialog open onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isAccept ? "Accept this request?" : "Decline this request?"}
          </DialogTitle>
          <DialogDescription>
            {isAccept
              ? "The learner will be notified and you can begin coordinating the exchange."
              : "The learner will be notified that their request was not accepted."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <Avatar className="size-10">
            <AvatarImage
              src={exchange.learner.profileImage}
              alt={exchange.learner.name}
            />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(exchange.learner.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{exchange.exchangeTitle}</p>
            <p className="truncate text-sm text-muted-foreground">
              {exchange.offeredSkill.title} · {exchange.learner.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`response-message-${exchange.id}`}>
              {isAccept ? "Welcome message" : "Reason"}{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id={`response-message-${exchange.id}`}
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows={3}
              placeholder={
                isAccept
                  ? "Welcome! I'm excited to help you learn this skill..."
                  : "Thank you for your interest, but..."
              }
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Visible to the learner and saved in the exchange notes.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isAccept ? "success" : "destructive"}
              isLoading={isLoading}
              leftIcon={isAccept ? <Check /> : <X />}
            >
              {isAccept ? "Accept request" : "Decline request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
