"use client"

import { useState } from "react"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { useAuthActions } from "@convex-dev/auth/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { SignInFlow } from "../types"

interface SignInCardProps {
  setState: (state: SignInFlow) => void
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)

  const handleProviderSignIn = (value: "google" | "github") => {
    setPending(true)
    signIn(value).finally(() => setPending(false))
  }

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
          />
          <Input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            size="lg"
            variant="outline"
            className="relative w-full"
            onClick={() => handleProviderSignIn("google")}
            disabled={pending}
          >
            <FcGoogle className="absolute left-2.5 size-5" /> Continue with
            Google
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="relative w-full"
            onClick={() => handleProviderSignIn("github")}
            disabled={pending}
          >
            <FaGithub className="absolute left-2.5 size-5" /> Continue with
            Github
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Dont&apos;t have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="cursor-pointer text-sky-700 hover:underline"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
