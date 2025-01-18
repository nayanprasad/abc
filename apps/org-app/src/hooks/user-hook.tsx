import useSupabaseBrowser from "../utils/supabase/browser-client";
import { useQuery } from "@tanstack/react-query";
import { useQuery as usePostgrestQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getUserById } from "../utils/supabase/queries";
import { getCurrentUser } from "../utils/supabase/queries/user-queries";

export function useGetCurrentUser() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(supabase),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useGetUserById(id: string) {
  const supabase = useSupabaseBrowser();
  return usePostgrestQuery(getUserById(supabase, id));
}
