import { useQuery, useMutation } from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const hasAttemptedSetup = useRef(false);

  const autoSetupMatrix = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/matrix/auto-setup");
      return response.json();
    },
    onSuccess: (data) => {
      if (!data.success && data.error) {
        console.log("Matrix auto-setup not available:", data.error);
      }
    },
  });

  useEffect(() => {
    if (user && !hasAttemptedSetup.current && !autoSetupMatrix.isPending) {
      hasAttemptedSetup.current = true;
      autoSetupMatrix.mutate();
    }
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    matrixSetup: autoSetupMatrix.data,
  };
}
