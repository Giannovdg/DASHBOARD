"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabaseClient from "@/lib/supabase/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabaseClient.auth.getSession();
      if (error) {
        console.error("Error during auth callback:", error.message);
      }
      
      // Redirect to home page after successful authentication
      router.push("/");
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Authenticating...</h1>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      </div>
    </div>
  );
} 