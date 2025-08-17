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
    title: "Pastel gratis con la compra de una bebida",
    description: "Disfruta de un delicioso pastel por nuestra cuenta cuando compres cualquier bebida grande.",
    icon: <Gift className="h-6 w-6 text-primary" />,
  },
  {
    title: "Miércoles de puntos dobles",
    description: "Gana 2x puntos en todas tus compras, durante todo el día.",
    icon: <Star className="h-6 w-6 text-primary" />,
  },
  {
    title: "25% de descuento en mercancía",
    description: "Obtenga un descuento especial en todas nuestras tazas y vasos de marca.",
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
              <CardTitle>Tus ofertas personalizadas</CardTitle>
              <CardDescription>
                Ofertas especiales, solo para ti.
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
                    <Button className="w-full">Canjear ahora</Button>
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
