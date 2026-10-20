import { NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";

export function Brand({ to = "/" }: { to?: string }) {
  return (
    <Link className="brand" to={to} aria-label="Stillnote home">
      <span className="brand-mark">
        <NotebookPen size={21} strokeWidth={1.7} />
      </span>
      <span>
        stillnote<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
