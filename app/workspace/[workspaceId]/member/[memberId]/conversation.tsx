"use client"

import { Loader } from "lucide-react"

import { usePanel } from "@/hooks/use-panel"
import { Doc } from "@/convex/_generated/dataModel"
import { useMemberId } from "@/hooks/use-member-id"
import { MessageList } from "@/components/message-list"
import { useGetMember } from "@/features/members/api/use-get-member"
import { useGetMessages } from "@/features/messages/api/use-get-messages"

import { Header } from "./header"
import { ChatInput } from "./chat-input"

interface ConversationProps {
  conversation: Doc<"conversations">
}

export const Conversation = ({ conversation }: ConversationProps) => {
  const memberId = useMemberId()

  const { onOpenProfile } = usePanel()

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId
  })
  const { results, status, loadMore } = useGetMessages({
    conversationId: conversation._id
  })

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />

      <MessageList
        data={results}
        variant="conversation"
        memberName={member?.user.name}
        memberImage={member?.user.image}
        loadMore={loadMore}
        canLoadMore={status === "CanLoadMore"}
        isLoadingMore={status === "LoadingMore"}
      />

      <ChatInput
        conversationId={conversation._id}
        placeholder={`Message ${member?.user.name}`}
      />
    </div>
  )
}
