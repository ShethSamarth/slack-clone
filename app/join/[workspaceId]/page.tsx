"use client"

import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import VerificationInput from "react-verification-input"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useJoin } from "@/features/workspaces/api/use-join"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info"

const Join = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { mutate, isPending } = useJoin()
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })

  const isMember = useMemo(() => data?.isMember, [data?.isMember])

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`)
      toast.success("You are already a member of this workspace")
    }
  }, [isMember, router, workspaceId])

  const handleComplete = (joinCode: string) => {
    mutate(
      { workspaceId, joinCode },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`)
          toast.success("Workspace joined successfully")
        },
        onError: () => toast.error("Failed to join workspace")
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-sm">
      <Image alt="Logo" width={60} height={60} src="/logo.png" />
      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          autoFocus
          length={6}
          onComplete={handleComplete}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "flex items-center justify-center rounded-md border border-gray-300 text-lg font-medium uppercase text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black"
          }}
        />
      </div>
      <div className="flex gap-x-4">
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}

export default Join
