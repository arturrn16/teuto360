
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-components/Card";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type DashboardCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
  textColor: string;
};

export const DashboardCard = ({
  title,
  description,
  icon,
  to,
  color,
  textColor,
}: DashboardCardProps) => {
  return (
    <Link 
      to={to}
      className="block h-full transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
    >
      <Card 
        className={cn(`h-full border-0 shadow-md bg-gradient-to-br ${color}`)}
        hoverEffect
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            {icon}
          </div>
          <CardTitle className={`mt-4 ${textColor}`}>{title}</CardTitle>
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default DashboardCard;
