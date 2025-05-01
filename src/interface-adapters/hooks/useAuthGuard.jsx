"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "@/framework-drivers/token/checkToken";

const useAuthGuard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const valid = isTokenValid();
    console.log(valid)
    if (!valid) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  return loading;
};

export default useAuthGuard;
