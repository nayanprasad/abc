import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { createClient } from "../utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

type SupabaseJwtPayload = JwtPayload & {
  app_metadata: {
    role: string;
  };
};

export function useGetUser() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        const decodedJwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
        return {
          session,
          user: session.user,
          role: decodedJwt.app_metadata.role,
        };
      }
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export async function signInWithGoogle({
  next,
}: {
  next?: string | undefined | null;
}) {
  const supabase = createClient();
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
  } catch (error) {}
}
