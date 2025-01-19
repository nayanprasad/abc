import { TypedSupabaseClient } from "../../../../types/supabase/types";
import { jwtDecode, type JwtPayload } from "jwt-decode";

type SupabaseJwtPayload = JwtPayload & {
  app_metadata: {
    role: string;
  };
};

export function getUserById(client: TypedSupabaseClient, userId: string) {
  return client
    .from("users")
    .select(
      `
      id,
      name
    `,
    )
    .eq("id", userId)
    .throwOnError()
    .single();
}

export async function getCurrentUser(client: TypedSupabaseClient) {
  const {
    data: { session },
    error,
  } = await client.auth.getSession();
  if (error || !session) {
    return { session: null, role: null };
  }

  const decodedJwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
  return {
    session,
    role: decodedJwt.app_metadata.role,
  };
}
