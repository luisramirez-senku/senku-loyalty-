import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "../shared/logo";
import { Star } from "lucide-react";

export default function LoyaltyCard() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary text-primary-foreground p-6 relative">
        <div className="absolute inset-0 bg-grid-slate-100/10 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl">Charles Webb</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                    Gold Tier Member
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary-foreground" />
                <span className="text-lg font-semibold">Senku</span>
            </div>
        </div>
        <div className="relative z-10 mt-8 flex items-end justify-between">
            <div>
                <p className="text-sm text-primary-foreground/80">Points Balance</p>
                <p className="text-4xl font-bold">25,000</p>
            </div>
            <div className="flex items-center gap-1 text-primary-foreground/80">
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <span>Gold Member</span>
            </div>
        </div>
      </div>
      <CardFooter className="bg-background/80 backdrop-blur-sm p-4 flex flex-col sm:flex-row gap-2">
        <Button className="w-full">
            <Image src="/apple-wallet.svg" alt="Apple Wallet" width={24} height={24} className="mr-2" />
            Add to Apple Wallet
        </Button>
        <Button className="w-full" variant="outline">
            <Image src="/google-wallet.svg" alt="Google Wallet" width={24} height={24} className="mr-2" />
            Add to Google Wallet
        </Button>
      </CardFooter>
    </Card>
  );
}
