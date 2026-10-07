import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Empty / error state shown in place of list results
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  tone?: "default" | "error";
}) {
  return (
    <Card className="border-dashed bg-card/60">
      <CardContent className="flex flex-col items-center py-10 text-center">
        <div
          className={cn(
            "mb-4 flex size-14 items-center justify-center rounded-full",
            tone === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-accent text-accent-foreground"
          )}
        >
          <Icon className="size-7" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
        {action && <div className="mt-6">{action}</div>}
      </CardContent>
    </Card>
  );
}
