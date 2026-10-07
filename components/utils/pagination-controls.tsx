"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Returns page numbers with "ellipsis" gaps, e.g. [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
function getPageItems(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push("ellipsis");
    items.push(page);
  });
  return items;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        leftIcon={<ChevronLeft />}
      >
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {getPageItems(currentPage, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1.5 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === currentPage ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
          >
            {item}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        rightIcon={<ChevronRight />}
      >
        <span className="hidden sm:inline">Next</span>
      </Button>
    </nav>
  );
}
