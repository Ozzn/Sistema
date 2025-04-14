"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Mientras se valida la sesión, no renderizamos nada más que el loader
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Solo cuando está autenticado, renderiza los children
  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null; // Fallback para evitar parpadeos o errores
};

export default AuthGuard;
