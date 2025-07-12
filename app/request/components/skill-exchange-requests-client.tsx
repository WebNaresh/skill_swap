"use client";

/**
 * Skill Exchange Requests Client Component for SkillCircle Platform
 * Handles displaying and managing skill exchange requests
 */

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  BookOpen,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

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
  { value: "all", label: "All Requests" },
  { value: "incoming", label: "Incoming (Teaching)" },
  { value: "outgoing", label: "Outgoing (Learning)" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

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
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main requests content component
function SkillExchangeRequestsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state with proper hydration handling
  const [isClient, setIsClient] = useState(false);
  const [requestType, setRequestType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    setRequestType(searchParams.get("type") || "all");
    setStatusFilter(searchParams.get("status") || "all");
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  // Fetch requests data - only run when client is ready
  const { data, isLoading, error, refetch } = useQuery<RequestsResponse>({
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
    enabled: isClient,
  });

  // Update URL when filters change
  useEffect(() => {
    if (!isClient) return;

    const params = new URLSearchParams();
    if (requestType !== "all") params.set("type", requestType);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newURL = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newURL);
  }, [isClient, requestType, statusFilter, currentPage, pathname, router]);

  // Handle filter changes
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

  // Show loading state until client is ready
  if (!isClient) {
    return <RequestsLoadingFallback />;
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Request Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type
            </label>
            <select
              value={requestType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {REQUEST_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading requests...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">
            Failed to load requests. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : data?.data.exchanges.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No requests found
          </h3>
          <p className="text-gray-600 mb-4">
            {requestType === "incoming"
              ? "You haven't received any skill exchange requests yet."
              : requestType === "outgoing"
              ? "You haven't sent any skill exchange requests yet."
              : "You don't have any skill exchange requests yet."}
          </p>
          <button
            onClick={() => router.push("/search")}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Browse Skills
          </button>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {data?.data.pagination.totalCount} Request
              {data?.data.pagination.totalCount !== 1 ? "s" : ""} Found
            </h2>
            <p className="text-gray-600">
              Page {data?.data.pagination.currentPage} of{" "}
              {data?.data.pagination.totalPages}
            </p>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {data?.data.exchanges.map((exchange) => (
              <SkillExchangeCard key={exchange.id} exchange={exchange} />
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

// Skill Exchange Card Component
function SkillExchangeCard({ exchange }: { exchange: SkillExchange }) {
  const [isResponding, setIsResponding] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
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
      // Invalidate and refetch the requests list
      queryClient.invalidateQueries({ queryKey: ["skill-exchange-requests"] });

      // Show success message
      alert(
        `Request ${
          data.data.status === "ACCEPTED" ? "accepted" : "rejected"
        } successfully!`
      );

      // Close modal
      setShowResponseModal(false);
      setResponseAction(null);
    },
    onError: (error) => {
      console.error("Error responding to request:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to respond to request. Please try again."
      );
    },
    onSettled: () => {
      setIsResponding(false);
    },
  });

  // Handle action button clicks
  const handleActionClick = (action: "accept" | "reject") => {
    setResponseAction(action);
    setShowResponseModal(true);
  };

  // Handle response submission
  const handleResponseSubmit = (responseMessage?: string) => {
    if (!responseAction) return;

    setIsResponding(true);
    respondMutation.mutate({
      action: responseAction,
      responseMessage,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "ACCEPTED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "IN_PROGRESS":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const otherUser =
    exchange.userRole === "teacher" ? exchange.learner : exchange.teacher;
  const isTeaching = exchange.userRole === "teacher";

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={otherUser.profileImage}
              alt={otherUser.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            {otherUser.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {exchange.exchangeTitle}
            </h3>
            <p className="text-sm text-gray-600">
              {isTeaching ? "Learning from" : "Teaching to"} {otherUser.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusIcon(exchange.status)}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              exchange.status
            )}`}
          >
            {exchange.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Skill Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-sky-600" />
          <span className="font-medium text-gray-900">
            {exchange.offeredSkill.title}
          </span>
          <span className="text-sm text-gray-500">
            ({exchange.offeredSkill.category})
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {exchange.offeredSkill.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Level: {exchange.offeredSkill.experienceLevel}</span>
          {exchange.estimatedHours && (
            <span>Duration: {exchange.estimatedHours} hours</span>
          )}
          <span>Format: {exchange.format.replace("_", " ")}</span>
        </div>
      </div>

      {/* Agreement Terms */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Agreement Terms:</h4>
        <p className="text-sm text-gray-600">{exchange.agreementTerms}</p>
      </div>

      {/* Action Buttons for Teachers with Pending Requests */}
      {exchange.userRole === "teacher" && exchange.status === "PENDING" && (
        <div className="mb-4 pt-4 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => handleActionClick("accept")}
              disabled={isResponding}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4" />
              {isResponding && responseAction === "accept"
                ? "Accepting..."
                : "Accept"}
            </button>
            <button
              onClick={() => handleActionClick("reject")}
              disabled={isResponding}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4" />
              {isResponding && responseAction === "reject"
                ? "Rejecting..."
                : "Reject"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Created: {formatDate(exchange.createdAt)}</span>
          {exchange.scheduledStart && (
            <span>Scheduled: {formatDate(exchange.scheduledStart)}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {exchange.userRole === "teacher" ? (
            <User className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowRight className="h-4 w-4 text-blue-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {exchange.userRole === "teacher" ? "Teaching" : "Learning"}
          </span>
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && responseAction && (
        <ResponseModal
          action={responseAction}
          exchange={exchange}
          onSubmit={handleResponseSubmit}
          onClose={() => {
            setShowResponseModal(false);
            setResponseAction(null);
          }}
          isLoading={isResponding}
        />
      )}
    </div>
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
  const actionText = isAccept ? "Accept" : "Reject";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {actionText} Skill Exchange Request
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>

          {/* Request Summary */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">
              {exchange.exchangeTitle}
            </h4>
            <p className="text-sm text-gray-600">
              Skill: {exchange.offeredSkill.title}
            </p>
            <p className="text-sm text-gray-600">
              Learner: {exchange.learner.name}
            </p>
          </div>

          {/* Action Confirmation */}
          <div
            className={`mb-4 p-3 rounded-lg ${
              isAccept
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`text-sm ${
                isAccept ? "text-green-800" : "text-red-800"
              }`}
            >
              {isAccept
                ? "You are about to accept this skill exchange request. The learner will be notified and you can begin coordinating the exchange."
                : "You are about to reject this skill exchange request. The learner will be notified that their request was not accepted."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isAccept
                  ? "Welcome Message (Optional)"
                  : "Reason for Rejection (Optional)"}
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                rows={3}
                placeholder={
                  isAccept
                    ? "Welcome! I'm excited to help you learn this skill..."
                    : "Thank you for your interest, but..."
                }
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be visible to the learner and stored in the
                exchange notes.
              </p>
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
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  isAccept
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={isLoading}
              >
                {isLoading ? `${actionText}ing...` : `${actionText} Request`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
