"use client"

import Quill from "quill"
import { useRef } from "react"
import dynamic from "next/dynamic"

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)

  return (
    <div className="w-full px-5">
      <Editor
        disabled={false}
        onSubmit={() => {}}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  )
}
