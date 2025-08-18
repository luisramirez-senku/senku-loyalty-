
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, collectionGroup } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import Logo from '@/components/app/shared/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function CustomerLookupPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ variant: 'destructive', title: 'Correo requerido', description: 'Por favor, introduce tu correo electrónico.' });
      return;
    }
    setLoading(true);

    try {
        const customersRef = collectionGroup(db, 'customers');
        const q = query(customersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({ variant: 'destructive', title: 'No encontrado', description: 'No pudimos encontrar una cuenta con ese correo electrónico.' });
        } else if (querySnapshot.size === 1) {
            // Only one program, redirect directly
            const customerDoc = querySnapshot.docs[0];
            router.push(`/customer/${customerDoc.id}`);
            toast({ title: '¡Éxito!', description: 'Redirigiendo a tu panel de lealtad.' });
        } else {
            // Multiple programs, redirect to selection page
            router.push(`/customer/programs?email=${encodeURIComponent(email)}`);
        }

    } catch (error) {
      console.error('Error looking up customer:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Ocurrió un problema al buscar tu cuenta.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Link href="/" className="flex items-center gap-4 mb-8">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Senku Lealtad</h1>
        </Link>
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Consulta tus Puntos</CardTitle>
                <CardDescription>
                    Ingresa tu correo electrónico para ver tu tarjeta de lealtad, puntos y recompensas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLookup} className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Buscar mi cuenta
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
