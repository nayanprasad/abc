"use client";
import { Button } from "@repo/ui/components/ui/button";
import { useGetCurrentUser, useGetUserById } from "../src/hooks/user-hook";
import { signOutAction } from "../actions/auth-action";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useGetCurrentUser();

  const { data: userById } = useGetUserById(
    "d6ebb2ea-2044-4ab6-bcd7-a7fc4775de1d",
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log({ data });
  console.log({ userById });

  return (
    <div>
      <Button
        variant={"destructive"}
        onClick={() => {
          router.push("/signin");
        }}
        // disabled={isPending}
      >
        Sign in
      </Button>

      <Button
        variant={"destructive"}
        onClick={() => {
          console.log("clicked");
          signOutAction();
        }}
      >
        Sign out
      </Button>
      {data?.session?.user.email}
    </div>
  );
}
