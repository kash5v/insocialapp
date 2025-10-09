import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, type VerifyOtpData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useSearch } from "wouter";

export default function VerifyEmail() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const emailParam = new URLSearchParams(searchParams).get("email");
  const [email, setEmail] = useState("");

  const form = useForm<VerifyOtpData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailParam || "",
      code: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      form.setValue("email", emailParam);
      setEmail(emailParam);
    }
  }, [emailParam, form]);

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyOtpData) => {
      return await apiRequest("/api/auth/verify-email", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired verification code",
        variant: "destructive",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest("/api/auth/resend-otp", "POST", { email });
    },
    onSuccess: () => {
      toast({
        title: "Code sent",
        description: "A new verification code has been sent to your email",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resend",
        description: error.message || "Failed to resend verification code",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VerifyOtpData) => {
    verifyMutation.mutate(data);
  };

  const handleResend = () => {
    const emailValue = form.getValues("email");
    if (!emailValue) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }
    setEmail(emailValue);
    resendMutation.mutate(emailValue);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-display">Verify your email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        data-testid="input-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={verifyMutation.isPending}
                data-testid="button-verify"
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="underline hover:text-primary cursor-pointer"
              data-testid="button-resend"
            >
              {resendMutation.isPending ? "Sending..." : "Resend"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
