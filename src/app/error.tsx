"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-32 text-center">
      <p className="text-muted-foreground/30 text-6xl font-bold">500</p>
      <h1 className="text-2xl font-bold tracking-tight">Algo salió mal</h1>
      <p className="text-muted-foreground max-w-sm">
        Ocurrió un error inesperado. Intenta de nuevo.
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
