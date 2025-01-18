"use client";
import { Button } from "@repo/ui/components/ui/button";
import { useSearchParams } from "next/navigation";
import useSupabaseBrowser from "../../../src/utils/supabase/browser-client";
import { useState } from "react";

export default function Page() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const supabase = useSupabaseBrowser();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setIsGoogleLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={signInWithGoogle}
      disabled={isGoogleLoading}
      className="w-full py-6 text-lg"
    >
      Sign in with Google
    </Button>
  );
}
