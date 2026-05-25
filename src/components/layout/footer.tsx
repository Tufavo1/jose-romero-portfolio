import Link from "next/link";
import { profile } from "@/data/profile";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-border/40 mt-20 border-t py-8">
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={profile.urls.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            Github <i data-lucide="link"></i>
          </Link>
          <Link
            href={profile.urls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            Linkedin <i data-lucide="link"></i>
          </Link>
          <Link
            href={`mailto:${profile.email}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="size-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
