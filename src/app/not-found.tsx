import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-32 text-center">
      <p className="text-muted-foreground/30 text-6xl font-bold">404</p>
      <h1 className="text-2xl font-bold tracking-tight">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
