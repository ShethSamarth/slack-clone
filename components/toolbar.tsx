import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Hint } from "./hint"
import { EmojiPopover } from "./emoji-popover"

interface ToolbarProps {
  isAuthor: boolean
  isPending: boolean
  handleEdit: () => void
  handleThread: () => void
  handleDelete: () => void
  handleReaction: (value: string) => void
  hideThreadButton?: boolean
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton
}: ToolbarProps) => {
  return (
    <div className="absolute right-5 top-0">
      <div className="rounded-md border bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button size="iconSm" variant="ghost" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
              onClick={handleEdit}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  )
}
