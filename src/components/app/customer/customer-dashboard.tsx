import LoyaltyCard from "./loyalty-card";
import VirtualAssistant from "./virtual-assistant";
import { Gift, Star, Ticket } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const offers = [
  {
    title: "Free Pastry with Drink Purchase",
    description: "Enjoy a delicious pastry on us when you buy any large drink.",
    icon: <Gift className="h-6 w-6 text-primary" />,
  },
  {
    title: "Double Points Wednesday",
    description: "Earn 2x points on all your purchases, all day long.",
    icon: <Star className="h-6 w-6 text-primary" />,
  },
  {
    title: "25% Off Merchandise",
    description: "Get a special discount on all our branded mugs and tumblers.",
    icon: <Ticket className="h-6 w-6 text-primary" />,
  },
];

export default function CustomerDashboard() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <LoyaltyCard />
          <Card>
            <CardHeader>
              <CardTitle>Your Personalized Offers</CardTitle>
              <CardDescription>
                Special deals, just for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {offers.map((offer, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="shrink-0">{offer.icon}</div>
                    <div className="flex-1">
                      <CardTitle>{offer.title}</CardTitle>
                      <CardDescription>{offer.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button className="w-full">Redeem Now</Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <VirtualAssistant />
        </div>
      </div>
    </div>
  );
}
