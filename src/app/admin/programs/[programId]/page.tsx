
import ProgramDetails from "@/components/app/admin/program-details";

export default function ProgramDetailsPage({ params }: { params: { programId: string } }) {
  // En una aplicación real, usarías el programId para obtener los datos del programa.
  // Por ahora, pasaremos datos de ejemplo.
  const program = {
    id: params.programId,
    name: "Programa de Puntos Premium",
    type: "Puntos" as const,
    status: "Activo" as const,
    members: 8234,
    created: "2023-01-15",
    description: "Un programa de lealtad basado en puntos para recompensar a nuestros mejores clientes.",
    rules: {
        pointsPerAmount: 10,
        amountForPoints: 1,
    },
    design: {
        logoText: "Café Estelar",
        backgroundColor: "#2E3A4D",
        foregroundColor: "#FFFFFF",
        labelColor: "#B0B7C1",
    }
  };

  return <ProgramDetails program={program} />;
}
