
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Logo from "@/components/app/shared/logo";
import { ArrowRight, Check, Sparkles, Star, Users, CreditCard } from "lucide-react";

const features = [
  {
    icon: <Star className="h-6 w-6 text-primary" />,
    title: "Programas Flexibles",
    description: "Crea programas de puntos, sellos o cashback que se adapten perfectamente a tu negocio.",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    title: "Pases de Wallet Digital",
    description: "Ofrece a tus clientes tarjetas de lealtad digitales para Apple y Google Wallet.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Segmentación de Clientes",
    description: "Agrupa a tus clientes en segmentos como 'VIP' o 'En Riesgo' para acciones dirigidas.",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: "Inteligencia Artificial",
    description: "Genera ofertas y campañas de marketing personalizadas con el poder de la IA.",
  },
];

const pricingPlans = [
    {
        name: "Básico",
        price: "$49",
        features: [
            "Hasta 1,000 miembros",
            "1 Programa de Lealtad",
            "Pases de Wallet Digital",
            "Soporte por correo electrónico"
        ],
        cta: "Empezar con Básico"
    },
    {
        name: "Profesional",
        price: "$99",
        features: [
            "Hasta 10,000 miembros",
            "Programas ilimitados",
            "Segmentación de Clientes",
            "Automatizaciones con IA",
            "Soporte prioritario"
        ],
        cta: "Elegir Profesional",
        featured: true
    },
    {
        name: "Empresarial",
        price: "Contacto",
        features: [
            "Miembros ilimitados",
            "Panel de Super Admin",
            "Marca Blanca",
            "Soporte Dedicado 24/7",
            "API de Integración"
        ],
        cta: "Contactar Ventas"
    }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2 mr-6">
                <Logo />
                <span className="font-bold">Senku Lealtad</span>
            </Link>
            <div className="flex flex-1 items-center justify-end gap-2">
                 <Button variant="ghost" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Registrarse</Link>
                </Button>
            </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto text-center py-20 md:py-32">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                Construye la Lealtad de tus Clientes
            </h1>
            <h2 className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Senku Lealtad te da las herramientas para crear programas de recompensas modernos, gestionar a tus clientes e impulsar el crecimiento con inteligencia artificial.
            </h2>
            <Button size="lg" asChild>
                <Link href="/signup">
                    Empezar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Todo lo que necesitas en una plataforma</h2>
                <p className="text-muted-foreground mt-2">Desde la personalización hasta la automatización, te tenemos cubierto.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-card/50">
                        <CardHeader>
                            {feature.icon}
                            <CardTitle className="mt-4">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-muted py-20">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Planes para cada tamaño de negocio</h2>
                    <p className="text-muted-foreground mt-2">Elige el plan que se ajuste a tus necesidades y empieza a crecer.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan) => (
                        <Card key={plan.name} className={`flex flex-col ${plan.featured ? 'border-primary ring-2 ring-primary' : ''}`}>
                            <CardHeader>
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription className="text-4xl font-bold">{plan.price}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                 <Button className="w-full" variant={plan.featured ? "default" : "outline"} asChild>
                                    <Link href="/signup">{plan.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>

       <footer className="border-t">
         <div className="container mx-auto py-6 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Senku Lealtad. Todos los derechos reservados.
         </div>
       </footer>
    </div>
  );
}
