"use client"

import { Loader, TriangleAlert } from "lucide-react"

import { useChannelId } from "@/hooks/use-channel-id"
import { MessageList } from "@/components/message-list"
import { useGetChannel } from "@/features/channels/api/use-get-channel"
import { useGetMessages } from "@/features/messages/api/use-get-messages"

import { Header } from "./header"
import { ChatInput } from "./chat-input"

const ChannelId = () => {
  const channelId = useChannelId()

  const { results, status, loadMore } = useGetMessages({ channelId })
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId
  })

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  )
}

export default ChannelId
