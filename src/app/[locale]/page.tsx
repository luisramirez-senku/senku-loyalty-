

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Logo from "@/components/app/shared/logo";
import { ArrowRight, Check, Sparkles, Star, Users, CreditCard, Bot, Palette, Workflow, X, BrainCircuit } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/app/shared/language-switcher";

const whySenkuFeatures = [
    {
        icon: <Palette className="h-8 w-8 mb-4 text-primary" />,
        titleKey: "whyModernExperienceTitle",
        descriptionKey: "whyModernExperienceDesc",
    },
    {
        icon: <Workflow className="h-8 w-8 mb-4 text-primary" />,
        titleKey: "whySmartManagementTitle",
        descriptionKey: "whySmartManagementDesc",
    },
    {
        icon: <Bot className="h-8 w-8 mb-4 text-primary" />,
        titleKey: "whyAIGrowthTitle",
        descriptionKey: "whyAIGrowthDesc",
    },
]

const aiFeatures = [
    {
        titleKey: "aiFeature1Title",
        descriptionKey: "aiFeature1Desc",
        image: "https://placehold.co/600x400.png"
    },
    {
        titleKey: "aiFeature2Title",
        descriptionKey: "aiFeature2Desc",
        image: "https://placehold.co/600x400.png"
    },
    {
        titleKey: "aiFeature3Title",
        descriptionKey: "aiFeature3Desc",
        image: "https://placehold.co/600x400.png"
    }
]


const pricingPlans = [
    {
        nameKey: "planEssential",
        price: "$29",
        priceMonthly: true,
        features: [
            "1 Loyalty Program",
            "1 Branch",
            "Unlimited Digital Cards",
            "Customer Segmentation",
            "AI Functionality",
            "Email Support"
        ],
        featureKeys: [
            "planFeature1Program",
            "planFeature1Branch",
            "planFeatureUnlimitedCards",
            "planFeatureSegmentation",
            "planFeatureAIFunctionality",
            "planFeatureEmailSupport"
        ],
        ctaKey: "ctaStartEssential"
    },
    {
        nameKey: "planGrowth",
        price: "$79",
        priceMonthly: true,
        features: [
            "5 Loyalty Programs",
            "Up to 5 Branches",
            "Unlimited Digital Cards",
            "Customer Segmentation",
            "AI Functionality",
            "Priority Support"
        ],
        featureKeys: [
            "planFeature5Programs",
            "planFeature5Branches",
            "planFeatureUnlimitedCards",
            "planFeatureSegmentation",
            "planFeatureAIFunctionality",
            "planFeaturePrioritySupport"
        ],
        ctaKey: "ctaChooseGrowth",
        featured: true
    },
    {
        nameKey: "planEnterprise",
        price: "Contact",
        priceMonthly: false,
        features: [
            "Unlimited Programs",
            "Unlimited Branches",
            "Super Admin Panel",
            "Custom White-labeling",
            "24/7 Dedicated Support",
            "API Access"
        ],
        featureKeys: [
            "planFeatureUnlimitedPrograms",
            "planFeatureUnlimitedBranches",
            "planFeatureSuperAdmin",
            "planFeatureWhitelabel",
            "planFeature247Support",
            "planFeatureAPIAccess"
        ],
        ctaKey: "ctaContactSales"
    }
]

const testimonials = [
    {
        quoteKey: "testimonial1Quote",
        name: "Ana Torres",
        roleKey: "testimonial1Role",
        avatar: "https://placehold.co/100x100.png?text=AT"
    },
    {
        quoteKey: "testimonial2Quote",
        name: "Carlos Vega",
        roleKey: "testimonial2Role",
        avatar: "https://placehold.co/100x100.png?text=CV"
    },
     {
        quoteKey: "testimonial3Quote",
        name: "Sofía Rojas",
        roleKey: "testimonial3Role",
        avatar: "https://placehold.co/100x100.png?text=SR"
    },
]

export default function Home() {
    const t = useTranslations('Landing');
    const t_pricing = useTranslations('Pricing');
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
            <Link href="/" className="flex items-center gap-2 mr-6">
                <Logo className="text-primary"/>
                <span className="font-bold">{t('appName')}</span>
            </Link>
            <div className="flex flex-1 items-center justify-end gap-2">
                 <LanguageSwitcher />
                 <Button variant="ghost" asChild>
                    <Link href="/login">{t('login')}</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/signup">{t('startFreeTrial')}</Link>
                </Button>
            </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto text-center py-20 md:py-32 flex flex-col items-center">
             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                {t.rich('heroTitle', { br: () => <br /> })}
            </h1>
            <h2 className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                {t('heroSubtitle')}
            </h2>
            <div className="flex gap-4">
                <Button size="lg" asChild>
                    <Link href="/signup">
                        {t('startNow')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="#pricing">{t('viewPlans')}</Link>
                </Button>
            </div>
            <div className="relative w-full max-w-4xl mt-16" data-ai-hint="loyalty card preview">
                <div className="absolute -inset-2 bg-primary/10 rounded-2xl blur-xl"></div>
                <Image src="https://placehold.co/1200x675.png" alt={t('heroImageAlt')} width={1200} height={675} className="rounded-xl border-2 border-primary/20 shadow-2xl shadow-primary/10" />
            </div>
        </section>

        {/* Why Senku Section */}
        <section id="why" className="py-20">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">{t('whyTitle')}</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t('whySubtitle')}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {whySenkuFeatures.map((feature) => (
                        <div key={feature.titleKey} className="p-8 border border-border/50 rounded-xl bg-card/50 text-center">
                            {feature.icon}
                            <h3 className="text-xl font-bold mb-2">{t(feature.titleKey as any)}</h3>
                            <p className="text-muted-foreground">{t(feature.descriptionKey as any)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* AI Section */}
        <section id="ai-features" className="py-20">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                        <BrainCircuit className="h-10 w-10 text-primary" />
                        {t('aiSectionTitle')}
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">{t('aiSectionSubtitle')}</p>
                </div>
                <div className="space-y-20">
                    {aiFeatures.map((feature, index) => (
                        <div key={feature.titleKey} className={`grid md:grid-cols-2 gap-10 items-center ${index % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}>
                            <div className={`${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                                <h3 className="text-2xl font-bold mb-4">{t(feature.titleKey as any)}</h3>
                                <p className="text-muted-foreground text-lg">{t(feature.descriptionKey as any)}</p>
                            </div>
                            <div className={`rounded-xl overflow-hidden ${index % 2 !== 0 ? 'md:col-start-1' : ''}`} data-ai-hint="abstract ai graphic">
                                <Image src={feature.image} alt={t(feature.titleKey as any)} width={600} height={400} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>


        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-secondary/30">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">{t_pricing('title')}</h2>
                    <p className="text-muted-foreground mt-4">{t_pricing('subtitle')}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                    {pricingPlans.map((plan) => (
                        <Card key={plan.nameKey} className={`flex flex-col ${plan.featured ? 'border-primary ring-2 ring-primary shadow-2xl shadow-primary/20' : ''}`}>
                            <CardHeader className="min-h-[140px]">
                                <CardTitle className="text-2xl">{t_pricing(plan.nameKey as any)}</CardTitle>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.priceMonthly && <span className="text-muted-foreground">/ {t_pricing('perMonth')}</span>}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <ul className="space-y-3">
                                {plan.featureKeys.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-muted-foreground">{t_pricing(feature as any)}</span>
                                    </li>
                                ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                 <Button className="w-full" size="lg" variant={plan.featured ? "default" : "outline"} asChild>
                                    <Link href="/signup">{t_pricing(plan.ctaKey as any)}</Link>
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
                    <h2 className="text-3xl md:text-4xl font-bold">{t('testimonialsTitle')}</h2>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="flex flex-col justify-between">
                            <CardContent className="pt-6">
                                <p className="italic">"{t(testimonial.quoteKey as any)}"</p>
                            </CardContent>
                            <CardFooter className="flex items-center gap-4">
                                <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full" data-ai-hint="person portrait"/>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{t(testimonial.roleKey as any)}</p>
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
                    {t('finalCtaTitle')}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    {t('finalCtaSubtitle')}
                </p>
                <Button size="lg" asChild>
                    <Link href="/signup">
                        {t('startYourFreeTrial')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </section>
      </main>

       <footer className="border-t border-border/40">
         <div className="container mx-auto py-8 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} {t('appName')}. {t('footerAllRightsReserved')}</p>
         </div>
       </footer>
    </div>
  );
}

