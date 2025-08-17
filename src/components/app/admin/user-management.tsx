
"use client";

import { useState } from "react";
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

const initialUsers: User[] = [
  {
    id: "user_1",
    name: "Alex Chen",
    email: "alex.chen@senku.com",
    role: "Cajero",
    status: "Activo",
    lastLogin: "2024-05-21 09:15 AM",
    avatar: "https://placehold.co/40x40.png",
    initials: "AC"
  },
  {
    id: "user_2",
    name: "Brenda Rodriguez",
    email: "brenda.r@senku.com",
    role: "Cajero",
    status: "Activo",
    lastLogin: "2024-05-21 08:55 AM",
    avatar: "https://placehold.co/40x40.png",
    initials: "BR"
  },
  {
    id: "user_3",
    name: "Charles Webb",
    email: "charles.w@senku.com",
    role: "Gerente",
    status: "Activo",
    lastLogin: "2024-05-20 05:30 PM",
    avatar: "https://placehold.co/40x40.png",
    initials: "CW"
  },
  {
    id: "user_4",
    name: "Diana Prince",
    email: "diana.p@senku.com",
    role: "Cajero",
    status: "Inactivo",
    lastLogin: "2024-04-10 11:00 AM",
    avatar: "https://placehold.co/40x40.png",
    initials: "DP"
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddEditOpen, setAddEditOpen] = useState(false);
  const [isDeactivateOpen, setDeactivateOpen] = useState(false);

  const handleOpenDialog = (user?: User) => {
    setSelectedUser(user || null);
    setAddEditOpen(true);
  };

  const handleOpenDeactivateDialog = (user: User) => {
    setSelectedUser(user);
    setDeactivateOpen(true);
  };

  const handleSaveUser = (user: User) => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      setUsers([...users, { ...user, id: `user_${Date.now()}` }]);
    }
    setAddEditOpen(false);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => 
        u.id === userId 
        ? { ...u, status: u.status === 'Activo' ? 'Inactivo' : 'Activo' } 
        : u
    ));
    setDeactivateOpen(false);
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
                {users.map((user) => (
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
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menú de palanca</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(user)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Restablecer contraseña</DropdownMenuItem>
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
                ))}
              </TableBody>
            </Table>
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
