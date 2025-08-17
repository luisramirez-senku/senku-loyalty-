"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Star, Ticket, ScanLine, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CashierView() {
  const [customerFound, setCustomerFound] = useState(false);

  const handleSearch = () => {
    // In a real app, this would perform a search.
    // For this demo, we'll just toggle the state.
    setCustomerFound(!customerFound);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Cashier Terminal</CardTitle>
          <CardDescription>
            Look up customers to apply loyalty rewards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="search">Find Customer</Label>
              <Input
                type="text"
                id="search"
                placeholder="Name, email, or phone number"
              />
            </div>
            <Button onClick={handleSearch} className="self-end">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="lg">
              <ScanLine className="mr-2 h-5 w-5" /> Scan Digital Card
            </Button>
          </div>

          {customerFound && (
            <Card className="bg-secondary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary" data-ai-hint="person portrait">
                  <AvatarImage src="https://placehold.co/100x100.png" />
                  <AvatarFallback>CW</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Charles Webb</CardTitle>
                  <CardDescription>Gold Tier Member</CardDescription>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary mt-1">
                    <Star className="h-4 w-4 fill-primary" />
                    <span>25,000 Points</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Available Rewards</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
                    <div className="flex items-center gap-3">
                      <Ticket className="h-5 w-5 text-primary" />
                      <span className="font-medium">Free Coffee or Tea</span>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
                    <div className="flex items-center gap-3">
                      <Ticket className="h-5 w-5 text-primary" />
                      <span className="font-medium">20% Off Merchandise</span>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              </CardContent>
               <CardFooter>
                 <Button variant="outline" className="w-full" onClick={() => setCustomerFound(false)}>
                    <User className="mr-2 h-4 w-4" /> End Session
                </Button>
               </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
