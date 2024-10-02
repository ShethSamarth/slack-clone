"use client"

import { useEffect } from "react"
import { AlertTriangle, Loader } from "lucide-react"

import { useMemberId } from "@/hooks/use-member-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation"

import { Conversation } from "./conversation"

const MemberId = () => {
  const memberId = useMemberId()
  const workspaceId = useWorkspaceId()

  const { data, mutate, isPending } = useCreateOrGetConversation()

  useEffect(() => {
    mutate({ workspaceId, memberId })
  }, [memberId, mutate, workspaceId])

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    )
  }

  return <Conversation conversation={data} />
}

export default MemberId
