
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
import { useAuth } from '@/hooks/use-auth';

export default function CustomerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: 'destructive', title: 'Campos requeridos', description: 'Por favor, introduce tu correo y contraseña.' });
      return;
    }
    setLoading(true);

    try {
        // Step 1: Log in the user via Firebase Auth
        await login(email, password);

        // Step 2: Find which loyalty programs they belong to
        const customersRef = collectionGroup(db, 'customers');
        const q = query(customersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({ variant: 'destructive', title: 'No encontrado', description: 'No estás inscrito en ningún programa de lealtad.' });
            // Optionally log the user out if they have an auth account but no loyalty profile
        } else if (querySnapshot.size === 1) {
            // Only one program, redirect directly to their dashboard
            const customerDoc = querySnapshot.docs[0];
            router.push(`/customer/${customerDoc.id}`);
            toast({ title: '¡Bienvenido!', description: 'Redirigiendo a tu panel de lealtad.' });
        } else {
            // Multiple programs, redirect to selection page
            router.push(`/customer/programs?email=${encodeURIComponent(email)}`);
        }

    } catch (error: any) {
      console.error('Error de inicio de sesión del cliente:', error);
      let errorMessage = "Ocurrió un problema al iniciar sesión.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = "Correo electrónico o contraseña incorrectos.";
      }
      toast({ variant: 'destructive', title: 'Error de inicio de sesión', description: errorMessage });
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
                <CardTitle>Bienvenido a tus Programas</CardTitle>
                <CardDescription>
                    Inicia sesión para ver tu tarjeta de lealtad, puntos y recompensas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
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
                     <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Iniciar Sesión
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
