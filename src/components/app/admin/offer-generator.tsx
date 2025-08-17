"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  generatePersonalizedOffers,
  type GeneratePersonalizedOffersOutput,
} from "@/ai/flows/generate-personalized-offers";
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
import { Loader, Sparkles, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required."),
  purchaseHistory: z.string().min(1, "Purchase history is required."),
  loyaltyTier: z.string().min(1, "Loyalty tier is required."),
  pointsBalance: z.coerce.number().min(0, "Points balance must be a positive number."),
  preferences: z.string().min(1, "Preferences are required."),
});

export default function OfferGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<GeneratePersonalizedOffersOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "CUST-007",
      purchaseHistory: "Frequent coffee and pastry purchases, occasionally buys merchandise.",
      loyaltyTier: "Gold",
      pointsBalance: 12500,
      preferences: "Enjoys trying new coffee blends, interested in discounts on merchandise.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await generatePersonalizedOffers(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate offers. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Personalized Offer Generator
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>
              Enter customer information to generate tailored offers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CUST-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purchaseHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase History</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Buys coffee every morning..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="loyaltyTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loyalty Tier</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Gold, Silver, Bronze" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pointsBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Balance</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Prefers discounts on food..."
                          {...field}
                        />
                      </FormControl>
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
                  Generate Offers
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Suggested Offers</CardTitle>
              <CardDescription>
                AI-generated offers tailored to the customer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
              {loading && (
                <div className="flex justify-center items-center py-16">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {result ? (
                result.offers.map((offer, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        {offer.offerName}
                      </CardTitle>
                      <CardDescription>{offer.offerDescription}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center text-sm">
                      <Badge variant="secondary">{offer.discountCode}</Badge>
                      <span className="text-muted-foreground">
                        Expires: {offer.expirationDate}
                      </span>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                !loading && (
                  <div className="text-center text-muted-foreground py-16">
                    <p>Generated offers will appear here.</p>
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
