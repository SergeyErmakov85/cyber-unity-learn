import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CrossLinkToHubProps {
  hubPath: string;
  hubAnchor?: string;
  children: React.ReactNode;
  hubTitle?: string;
}

const CrossLinkToHub = ({ hubPath, hubAnchor, children, hubTitle }: CrossLinkToHubProps) => {
  const to = hubAnchor ? `${hubPath.split("#")[0]}#${hubAnchor}` : hubPath;
  const link = (
    <Link to={to} className="inline-flex items-center gap-1 text-primary hover:underline transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
      <ExternalLink className="inline w-3 h-3 flex-shrink-0" aria-hidden />
      {children}
    </Link>
  );
  if (!hubTitle) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs">{hubTitle}</TooltipContent>
    </Tooltip>
  );
};

export default CrossLinkToHub;
