"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { logInSchema, type LogInValues } from "@/lib/validators";
import { auth } from "@/lib/site";
import { EASE } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";

/**
 * The login screen, matching the source exactly: Username, Password, "Log in",
 * "Forgot Password", "Create", "Don't Have an Account?".
 *
 * The source shows both actions on one screen, so there is no separate sign-up
 * page. It defines no password rules, no OAuth providers and no Forgot Password
 * screen, so none are implemented.
 */
export function LoginForm() {
  const [reveal, setReveal] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LogInValues>({
    resolver: zodResolver(logInSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LogInValues) => {
    // Connect this to your authentication provider.
    await new Promise((r) => setTimeout(r, 800));
    console.warn("Log in", values.username);
    setDone(true);
  };

  return (
    <div>
      <h1 className="text-[clamp(2rem,3.6vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.04em] text-gradient">
        {auth.welcome}
      </h1>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col items-center py-16 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan/30 bg-cyan/[0.08] text-cyan shadow-[0_0_45px_-10px_rgba(34,224,255,0.7)]">
              <Check className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <p className="mt-6 text-[0.9375rem] text-mist">
              Connect an authentication provider to complete the session.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-12 space-y-6"
          >
            <Field label={auth.username} htmlFor="username" error={errors.username?.message}>
              <Input
                id="username"
                autoComplete="username"
                aria-invalid={!!errors.username}
                {...register("username")}
              />
            </Field>

            <Field label={auth.password} htmlFor="password" error={errors.password?.message}>
              <div className="relative">
                <Input
                  id="password"
                  type={reveal ? "text" : "password"}
                  autoComplete="current-password"
                  className="pr-14"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  aria-label={reveal ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-mist transition-colors duration-400 hover:text-cloud"
                >
                  {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="w-full"
                magnetic={false}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {auth.logIn}
                  </>
                ) : (
                  auth.logIn
                )}
              </Button>

              <div className="mt-4 text-center">
                <Link
                  href="#"
                  className="text-[0.8125rem] text-mist transition-colors duration-500 hover:text-cyan"
                >
                  {auth.forgotPassword}
                </Link>
              </div>
            </div>

            <div className="pt-6">
              <Button type="button" size="lg" variant="glass" className="w-full" magnetic={false}>
                {auth.create}
              </Button>
              <p className="mt-4 text-center text-[0.8125rem] text-mist-deep">{auth.noAccount}</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
