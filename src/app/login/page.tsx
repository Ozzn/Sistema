"use client";

// Importación de hooks y funciones necesarias
import { useState, useEffect } from "react"; // Hook para manejar estado y efectos secundarios
import { signIn, useSession } from "next-auth/react"; // Funciones de autenticación de NextAuth
import { useRouter } from "next/navigation"; // Para redireccionar al usuario

const Login = () => {
  // Obtención del estado de sesión actual del usuario
  const { data: session, status } = useSession();

  // Estado local para guardar el correo y la contraseña del formulario
  const [form, setForm] = useState({ email: "", password: "" });

  // Hook de Next.js para redirección
  const router = useRouter();

  // Función que maneja el envío del formulario de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir recarga de la página

    // Llamada a NextAuth para iniciar sesión con el proveedor "credentials"
    const res = await signIn("credentials", {
      redirect: false, // No redirigir automáticamente
      email: form.email,
      password: form.password,
    });

    // Si el inicio de sesión fue exitoso, redirigir al perfil
    if (res?.ok) {
      router.push("/profile");
    } else {
      alert("Error en el inicio de sesión"); // Mostrar error en caso contrario
    }
  };

  // Redirige automáticamente al perfil si el usuario ya está autenticado
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile");
    }
  }, [status, router]);

  return (
    // Contenedor principal centrado con fondo gris
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      {/* Tarjeta blanca con sombra para el formulario */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* Campo de correo electrónico */}
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            {/* Campo de contraseña */}
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Iniciar sesión
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default Login;
