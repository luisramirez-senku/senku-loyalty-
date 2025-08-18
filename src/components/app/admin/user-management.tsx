

"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddEditUserDialog } from "./add-edit-user-dialog";
import { DeactivateUserDialog } from "./deactivate-user-dialog";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { createNewUser } from "@/lib/firebase/actions";

export type UserRole = "Cajero" | "Gerente" | "Admin";
export type UserStatus = "Activo" | "Inactivo";

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastLogin: string;
    avatar?: string;
    initials: string;
};

export default function UserManagement() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddEditOpen, setAddEditOpen] = useState(false);
  const [isDeactivateOpen, setDeactivateOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
        if (!authUser) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const usersCollection = collection(db, "tenants", authUser.uid, "users");
            const querySnapshot = await getDocs(usersCollection);
            const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar los usuarios.",
            });
        } finally {
            setLoading(false);
        }
    };
    fetchUsers();
  }, [authUser]);

  const handleOpenDialog = (user?: User) => {
    setSelectedUser(user || null);
    setAddEditOpen(true);
  };

  const handleOpenDeactivateDialog = (user: User) => {
    setSelectedUser(user);
    setDeactivateOpen(true);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'initials' | 'lastLogin' | 'status'> & { id?: string }) => {
    if (!authUser) return;
    try {
        if (userData.id) { // Editing existing user
            const userRef = doc(db, "tenants", authUser.uid, "users", userData.id);
            const { id, ...dataToUpdate } = userData;
            await updateDoc(userRef, dataToUpdate);

            const updatedUser = { ...users.find(u => u.id === id)!, ...dataToUpdate };
            setUsers(users.map(u => u.id === id ? updatedUser : u));
            toast({ title: "Usuario Actualizado", description: "Los datos del usuario han sido guardados." });
        } else { // Adding new user
            const newUser = await createNewUser(authUser.uid, userData as any); // Cast because role is already validated
            const userDocRef = doc(db, "tenants", authUser.uid, "users", newUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            const newUserDoc = { id: userDocSnap.id, ...userDocSnap.data() } as User;
            setUsers([...users, newUserDoc]);
            toast({ title: "Usuario Agregado", description: "El nuevo usuario ha sido creado. La contraseña temporal se ha mostrado en la consola del servidor." });
        }
        setAddEditOpen(false);
    } catch (error: any) {
        console.error("Error guardando el usuario:", error);
        let desc = "No se pudo guardar el usuario.";
        if (error.message.includes("EMAIL_EXISTS")) {
            desc = "Ya existe un usuario con este correo electrónico."
        }
        toast({ variant: "destructive", title: "Error", description: desc });
    }
  };

  const handleToggleStatus = async (userId: string) => {
    if (!authUser) return;
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
        const newStatus = user.status === 'Activo' ? 'Inactivo' : 'Activo';
        const userRef = doc(db, "tenants", authUser.uid, "users", userId);
        await updateDoc(userRef, { status: newStatus });

        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        toast({ title: "Estado Actualizado", description: `El usuario ha sido ${newStatus.toLowerCase()}.` });
    } catch (error) {
        console.error("Error al actualizar estado:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el estado del usuario." });
    } finally {
        setDeactivateOpen(false);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
                <p className="text-muted-foreground">
                    Administre las cuentas de sus cajeros y gerentes.
                </p>
            </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Usuario
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Cuentas de Usuario</CardTitle>
            <CardDescription>
              A continuación se muestra una lista de todos los usuarios de su organización.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Último inicio de sesión</TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="hidden h-9 w-9 sm:flex" data-ai-hint="person portrait">
                                <AvatarImage src={user.avatar} alt="Avatar" />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                        <Badge variant={user.status === 'Activo' ? 'default' : 'secondary'}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {user.lastLogin}
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" disabled={user.id === authUser?.uid}>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menú de palanca</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(user)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleOpenDeactivateDialog(user)}
                                className={user.status === 'Activo' ? 'text-destructive' : ''}
                            >
                                {user.status === 'Activo' ? 'Desactivar' : 'Activar'}
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
             {!loading && users.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No se encontraron usuarios.
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddEditUserDialog 
        isOpen={isAddEditOpen} 
        setIsOpen={setAddEditOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      {selectedUser && (
        <DeactivateUserDialog
            isOpen={isDeactivateOpen}
            setIsOpen={setDeactivateOpen}
            user={selectedUser}
            onConfirm={handleToggleStatus}
        />
      )}
    </>
  );
}
