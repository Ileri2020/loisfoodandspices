import { SEO_CONFIG, SYSTEM_CONFIG } from "@/app/layout";
import { GithubIcon } from "lucide-react";
import Link from "next/link";



export function HeroBadge() {

  return (
    <Link
      className={`
        inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm
        font-semibold text-primary
      `}
      href={
        2
          ? ``
          : "/products"
      }
      rel={2 ? "noopener noreferrer" : undefined}
      target={2 ? "_blank" : undefined}
    >
      {2 ? (
        <div className="flex items-center gap-1">
          <span>{SEO_CONFIG.fullName}</span>
          <span className="text-muted-foreground">|</span>
          <GithubIcon className="h-3.5 w-3.5" />
          {2 && (
            <span>⭐ {'2'} stars on GitHub</span>
          )}
        </div>
      ) : (
        SEO_CONFIG.fullName
      )}
    </Link>
  );
}
