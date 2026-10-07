import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 sm:flex">
            <Icon className="size-6" />
          </div>
        )}
        <div>
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
