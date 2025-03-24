
import { cn } from "@/lib/utils";

interface LoaderSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "white";
}

export function LoaderSpinner({
  className,
  size = "md",
  color = "primary",
  ...props
}: LoaderSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  const colorClasses = {
    primary: "border-blue-500 border-t-transparent",
    secondary: "border-gray-300 border-t-transparent",
    accent: "border-indigo-600 border-t-transparent",
    white: "border-white border-t-transparent"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoaderSpinner size="lg" />
      <p className="mt-4 text-gray-600 animate-pulse">Carregando...</p>
    </div>
  );
}
