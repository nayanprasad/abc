"use client";
import { Button } from "@repo/ui/components/ui/button";
import { useSearchParams } from "next/navigation";
import { signInWithGoogle, useGetUser } from "../src/hooks/user-hook";

export default function Home() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const user = useGetUser();

  console.log({ user });

  return (
    <div>
      Event app
      <Button
        variant={"destructive"}
        onClick={() => {
          console.log("clicked");
          void signInWithGoogle({ next });
        }}
      >
        asdf
      </Button>
      {user.data?.user.email}
    </div>
  );
}
