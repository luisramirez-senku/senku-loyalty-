
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Logo from "@/components/app/shared/logo";
import { ArrowRight, Check, Sparkles, Star, Users, CreditCard, Bot, Palette, Workflow, X } from "lucide-react";
import Image from "next/image";

const whySenkuFeatures = [
    {
        icon: <Palette className="h-8 w-8 mb-4 text-primary" />,
        title: "Experiencia Moderna",
        description: "Ofrece a tus clientes pases de lealtad digitales para Apple y Google Wallet. Moderno, sin fricciones y siempre en su bolsillo.",
    },
    {
        icon: <Workflow className="h-8 w-8 mb-4 text-primary" />,
        title: "Gestión Inteligente",
        description: "Segmenta clientes, visualiza análisis y gestiona múltiples programas desde un único panel de control intuitivo y potente.",
    },
    {
        icon: <Bot className="h-8 w-8 mb-4 text-primary" />,
        title: "Crecimiento con IA",
        description: "Utiliza nuestro asistente de IA para generar campañas de marketing, automatizar ofertas y obtener ideas para fidelizar a tus clientes.",
    },
]

const comparisonData = [
    { feature: "Pases de Wallet Digitales", senku: true, boomerang: true },
    { feature: "Programas de Puntos, Sellos y Cashback", senku: true, boomerang: true },
    { feature: "Asistente Virtual con IA", senku: true, boomerang: false },
    { feature: "Generador de Ofertas con IA", senku: true, boomerang: false },
    { feature: "Automatizaciones de Marketing", senku: true, boomerang: false },
    { feature: "Segmentación Avanzada de Clientes", senku: true, boomerang: true },
    { feature: "Panel de Análisis Completo", senku: true, boomerang: false },
    { feature: "API para Integraciones", senku: "Próximamente", boomerang: true },
]

const pricingPlans = [
    {
        name: "Esencial",
        price: "$29",
        priceMonthly: true,
        features: [
            "1 Programa de Lealtad",
            "1 Sucursal",
            "Tarjetas Digitales Ilimitadas",
            "Segmentación de Clientes",
            "Funcionalidades de IA",
            "Soporte por correo electrónico"
        ],
        cta: "Empezar con Esencial"
    },
    {
        name: "Crecimiento",
        price: "$79",
        priceMonthly: true,
        features: [
            "5 Programas de Lealtad",
            "Hasta 5 Sucursales",
            "Tarjetas Digitales Ilimitadas",
            "Segmentación de Clientes",
            "Funcionalidades de IA",
            "Soporte prioritario"
        ],
        cta: "Elegir Crecimiento",
        featured: true
    },
    {
        name: "Empresarial",
        price: "Contacto",
        priceMonthly: false,
        features: [
            "Programas Ilimitados",
            "Sucursales Ilimitadas",
            "Panel de Super Admin",
            "Marca Blanca Personalizada",
            "Soporte Dedicado 24/7",
            "Acceso a la API"
        ],
        cta: "Contactar Ventas"
    }
]

const testimonials = [
    {
        quote: "Senku Lealtad ha transformado la forma en que interactuamos con nuestros clientes. ¡La función de IA para generar ofertas es simplemente mágica!",
        name: "Ana Torres",
        role: "Dueña de 'El Café de la Esquina'",
        avatar: "https://placehold.co/100x100.png?text=AT"
    },
    {
        quote: "Pasamos de tarjetas de cartón a pases digitales de Wallet, y nuestros clientes están encantados. La tasa de retención ha subido un 25%.",
        name: "Carlos Vega",
        role: "Gerente de 'Moda Urbana'",
        avatar: "https://placehold.co/100x100.png?text=CV"
    },
     {
        quote: "La facilidad de uso del panel y los análisis detallados nos han dado una visión que nunca tuvimos. Altamente recomendado.",
        name: "Sofía Rojas",
        role: "Propietaria de 'Belleza Total Spa'",
        avatar: "https://placehold.co/100x100.png?text=SR"
    },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
            <Link href="/" className="flex items-center gap-2 mr-6">
                <Logo className="text-primary"/>
                <span className="font-bold">Senku Lealtad</span>
            </Link>
            <div className="flex flex-1 items-center justify-end gap-2">
                 <Button variant="ghost" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/signup">Empezar Prueba Gratuita</Link>
                </Button>
            </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto text-center py-20 md:py-32 flex flex-col items-center">
             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                La Plataforma de Lealtad con IA <br /> que tus Clientes Amarán
            </h1>
            <h2 className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                Deja atrás las tarjetas de cartón. Crea programas de lealtad digitales, entiende a tus clientes y haz crecer tu negocio con el poder de la inteligencia artificial.
            </h2>
            <div className="flex gap-4">
                <Button size="lg" asChild>
                    <Link href="/signup">
                        Empezar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="#pricing">Ver Planes</Link>
                </Button>
            </div>
            <div className="relative w-full max-w-4xl mt-16" data-ai-hint="loyalty card preview">
                <div className="absolute -inset-2 bg-primary/10 rounded-2xl blur-xl"></div>
                <Image src="https://placehold.co/1200x675.png" alt="Vista previa del panel de Senku Lealtad" width={1200} height={675} className="rounded-xl border-2 border-primary/20 shadow-2xl shadow-primary/10" />
            </div>
        </section>

        {/* Why Senku Section */}
        <section id="why" className="py-20">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">La Lealtad ha Evolucionado</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">No se trata solo de puntos. Se trata de crear experiencias personalizadas que hacen que los clientes vuelvan una y otra vez.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {whySenkuFeatures.map((feature) => (
                        <div key={feature.title} className="p-8 border border-border/50 rounded-xl bg-card/50 text-center">
                            {feature.icon}
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Comparison Section */}
        <section id="comparison" className="py-20">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Más que una Alternativa</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">BoomerangMe es una gran herramienta. Senku Lealtad es una plataforma de crecimiento completa.</p>
                </div>
                <Card className="max-w-4xl mx-auto">
                    <CardContent className="p-0">
                         <div className="grid grid-cols-3 divide-x divide-border">
                            <div className="p-4 font-semibold">Característica</div>
                            <div className="p-4 font-semibold text-center flex items-center justify-center gap-2"><Logo className="h-5 w-5 text-primary"/> Senku</div>
                            <div className="p-4 font-semibold text-center">BoomerangMe</div>
                         </div>
                         {comparisonData.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 divide-x divide-border border-t">
                                <div className="p-4 text-muted-foreground">{item.feature}</div>
                                <div className="p-4 text-center flex justify-center items-center">
                                    {item.senku === true ? <Check className="h-6 w-6 text-green-500" /> : item.senku === false ? <X className="h-6 w-6 text-destructive" /> : <span className="text-xs text-muted-foreground">{item.senku}</span>}
                                </div>
                                <div className="p-4 text-center flex justify-center items-center">
                                    {item.boomerang === true ? <Check className="h-6 w-6 text-green-500" /> : item.boomerang === false ? <X className="h-6 w-6 text-destructive" /> : <span className="text-xs text-muted-foreground">{item.boomerang}</span>}
                                </div>
                            </div>
                         ))}
                    </CardContent>
                </Card>
            </div>
        </section>


        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-secondary/30">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Planes para cada Etapa de tu Negocio</h2>
                    <p className="text-muted-foreground mt-4">Precios transparentes y justos. Sin sorpresas.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                    {pricingPlans.map((plan) => (
                        <Card key={plan.name} className={`flex flex-col ${plan.featured ? 'border-primary ring-2 ring-primary shadow-2xl shadow-primary/20' : ''}`}>
                            <CardHeader className="min-h-[140px]">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.priceMonthly && <span className="text-muted-foreground">/ mes</span>}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <ul className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                 <Button className="w-full" size="lg" variant={plan.featured ? "default" : "outline"} asChild>
                                    <Link href="/signup">{plan.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Amado por Negocios como el Tuyo</h2>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="flex flex-col justify-between">
                            <CardContent className="pt-6">
                                <p className="italic">"{testimonial.quote}"</p>
                            </CardContent>
                            <CardFooter className="flex items-center gap-4">
                                <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full" data-ai-hint="person portrait"/>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
            <div className="container mx-auto text-center">
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    ¿Listo para Dejar de Perder Clientes?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Lanza tu programa de lealtad en minutos y empieza a construir relaciones duraderas que impulsan tu negocio.
                </p>
                <Button size="lg" asChild>
                    <Link href="/signup">
                        Comienza tu Prueba Gratuita <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </section>
      </main>

       <footer className="border-t border-border/40">
         <div className="container mx-auto py-8 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} Senku Lealtad. Todos los derechos reservados.</p>
         </div>
       </footer>
    </div>
  );
}
