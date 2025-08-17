
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
    code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast({ title: "Copiado al portapapeles" });
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="relative font-mono text-sm bg-muted text-muted-foreground p-3 rounded-md mt-2 flex items-center justify-between">
            <pre className="overflow-x-auto"><code>{code}</code></pre>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                onClick={handleCopy}
            >
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
            </Button>
        </div>
    )
}
