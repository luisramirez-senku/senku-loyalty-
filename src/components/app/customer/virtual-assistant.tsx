"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  loyaltyProgramAssistant,
} from "@/ai/flows/loyalty-program-assistant";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader, Send, Sparkles, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function VirtualAssistant() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! ¿Cómo puedo ayudarte con tu cuenta de lealtad hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // In a real app, this data would be fetched from a database
      const loyaltyProgramDetails = "El programa tiene tres niveles: Bronce (0-4999 pts), Plata (5000-9999 pts) y Oro (10000+ pts). Las recompensas incluyen bebidas gratis, descuentos y ofertas exclusivas.";
      const customerInformation = "Cliente: Charles Webb, Nivel: Oro, Puntos: 25,000.";

      const result = await loyaltyProgramAssistant({
        query: input,
        loyaltyProgramDetails,
        customerInformation,
      });
      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El asistente no está disponible actualmente. Por favor, inténtalo de nuevo más tarde.",
      });
       const assistantErrorMessage: Message = {
        role: "assistant",
        content: "Lo siento, tengo problemas para conectarme en este momento. Por favor, inténtalo de nuevo en un momento.",
      };
      setMessages((prev) => [...prev, assistantErrorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);
  
  return (
    <Card className="flex flex-col h-full max-h-[80vh]">
      <CardHeader>
        <CardTitle>
            <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Asistente virtual</span>
            </div>
        </CardTitle>
        <CardDescription>
          Pregúntame cualquier cosa sobre tu cuenta o recompensas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : ""
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[85%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === "user" && (
                    <Avatar className="w-8 h-8">
                        <AvatarFallback>
                            <User className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
            {loading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Sparkles className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                        <Loader className="w-4 h-4 animate-spin"/>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="min-h-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
