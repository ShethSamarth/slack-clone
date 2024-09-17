"use client"

import Quill from "quill"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { useRef, useState } from "react"

import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useCreateMessage } from "@/features/messages/api/use-create-message"

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)

  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const { mutate: createMessage } = useCreateMessage()

  const handleSubmit = async ({
    body,
    image
  }: {
    body: string
    image: File | null
  }) => {
    try {
      setIsPending(true)
      await createMessage(
        { workspaceId, channelId, body },
        { throwError: true }
      )

      setEditorKey((prevKey) => prevKey + 1)
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        disabled={isPending}
        innerRef={editorRef}
        onSubmit={handleSubmit}
        placeholder={placeholder}
      />
    </div>
  )
}
