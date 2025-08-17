"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  generatePromotionalText,
  type GeneratePromotionalTextOutput,
} from "@/ai/flows/generate-promotional-texts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
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
import { Loader, Sparkles, Clipboard, Check } from "lucide-react";

const formSchema = z.object({
    offerName: z.string().min(1, "Offer name is required."),
    offerDetails: z.string().min(1, "Offer details are required."),
    customerSegment: z.string().min(1, "Customer segment is required."),
    callToAction: z.string().min(1, "Call to action is required."),
    tone: z.string().min(1, "Tone is required."),
});

export default function PromotionGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<GeneratePromotionalTextOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        offerName: "Double Points Tuesday",
        offerDetails: "Earn double loyalty points on all purchases made on Tuesdays for the entire month of July.",
        customerSegment: "All loyalty members",
        callToAction: "Shop now",
        tone: "Exciting",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await generatePromotionalText(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate text. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (result) {
        navigator.clipboard.writeText(result.promotionalText);
        setCopied(true);
        toast({ title: "Copied to clipboard!" });
        setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Promotional Text Generator
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Offer Information</CardTitle>
            <CardDescription>
              Describe the promotion to generate compelling copy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="offerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Weekend Special" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="offerDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Get 20% off all pastries..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="customerSegment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Segment</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New customers, VIP members" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="callToAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call To Action</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Redeem Now, Learn More" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Exciting">Exciting</SelectItem>
                                <SelectItem value="Informative">Informative</SelectItem>
                                <SelectItem value="Urgency">Urgency</SelectItem>
                                <SelectItem value="Friendly">Friendly</SelectItem>
                                <SelectItem value="Professional">Professional</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Text
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <Card className="sticky top-20">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Generated Promotion</CardTitle>
                    <CardDescription>
                        AI-generated copy to engage your customers.
                    </CardDescription>
                </div>
                 {result && (
                     <Button variant="outline" size="icon" onClick={handleCopy} disabled={copied}>
                        {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                 )}
            </CardHeader>
            <CardContent className="space-y-4 min-h-[300px]">
              {loading && (
                <div className="flex justify-center items-center h-full">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {result ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {result.promotionalText}
                </div>
              ) : (
                !loading && (
                  <div className="flex justify-center items-center h-full text-center text-muted-foreground">
                    <p>Generated promotional text will appear here.</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
