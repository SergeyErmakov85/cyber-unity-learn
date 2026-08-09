import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { resolveTextbookHref } from "@/lib/textbook-links";
import { useTextbookContext } from "./TextbookContext";

interface LectureLinkProps {
  href?: string;
  children?: React.ReactNode;
}

/**
 * Ссылка внутри markdown лекции. Разбор адресов — в lib/textbook-links.ts,
 * здесь только отрисовка: внутренние идут через <Link> (SPA-навигация без
 * перезагрузки), внешние — в новой вкладке с пометкой.
 */
const LectureLink = ({ href, children }: LectureLinkProps) => {
  const { partDir } = useTextbookContext();

  if (!href) return <span>{children}</span>;

  const { to, external } = resolveTextbookHref(href, partDir);

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-1">
        {children}
        <ExternalLink className="h-3 w-3 flex-none translate-y-[1px] opacity-60" aria-hidden />
      </a>
    );
  }

  if (to.startsWith("#")) return <a href={to}>{children}</a>;

  return <Link to={to}>{children}</Link>;
};

export default LectureLink;
