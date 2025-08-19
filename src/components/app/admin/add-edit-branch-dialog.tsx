
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Branch } from "./branch-management";
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddEditBranchDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  branch: Branch | null;
  onSave: (branch: Omit<Branch, 'id'> & { id?: string }) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  address: z.string().min(1, "La dirección es requerida."),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const containerStyle = {
  width: '100%',
  height: '400px'
};

const libraries: "places"[] = ["places"];

export function AddEditBranchDialog({
  isOpen,
  setIsOpen,
  branch,
  onSave,
}: AddEditBranchDialogProps) {
  const { toast } = useToast();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      location: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
    }
  });

  const isEditing = !!branch;
  const currentMarkerPosition = form.watch('location');

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: branch?.name ?? "",
        address: branch?.address ?? "",
        location: branch?.location ?? { lat: 40.7128, lng: -74.0060 },
      });
    }
  }, [isOpen, branch, form]);

  useEffect(() => {
    if (loadError) {
      toast({ variant: "destructive", title: "Error de Google Maps", description: "No se pudo cargar la API de Google Maps. Verifique su clave de API en las variables de entorno." });
    }
  }, [loadError, toast]);

  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref);

  const onPlacesChanged = () => {
    if (searchBox) {
        const places = searchBox.getPlaces();
        const place = places?.[0];
        if (place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            form.setValue('location', { lat, lng });
            form.setValue('address', place.formatted_address || form.getValues('address'));
        }
    }
  };

  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
        form.setValue('location', { lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
        id: branch?.id,
        ...values,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Sucursal" : "Agregar Nueva Sucursal"}</DialogTitle>
          <DialogDescription>
            Complete los detalles para {isEditing ? "actualizar" : "crear"} una sucursal y seleccione su ubicación en el mapa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre de la sucursal</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Tienda Principal" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                            <Input placeholder="La dirección del negocio" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <div>
                        <FormLabel>Buscar Dirección en el Mapa</FormLabel>
                        {isLoaded && !loadError && (
                            <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                                <Input type="text" placeholder="Buscar ubicación..." className="mt-2" />
                            </StandaloneSearchBox>
                        )}
                    </div>
                </div>

                <div>
                    {isLoaded && !loadError ? (
                         <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={currentMarkerPosition}
                            zoom={15}
                        >
                            <Marker 
                                position={currentMarkerPosition} 
                                draggable={true}
                                onDragEnd={onMarkerDragEnd}
                            />
                        </GoogleMap>
                    ) : (
                        <div className="h-[400px] w-full bg-muted flex items-center justify-center rounded-md">
                            <Loader className="h-8 w-8 animate-spin" />
                        </div>
                    )}
                </div>
            </div>
           
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={!isLoaded || !!loadError}>{isEditing ? "Guardar Cambios" : "Crear Sucursal"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
