import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "./logo";
import { User } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Logo />
          <span className="font-bold">Senku Loyalty</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Future nav links can go here */}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
