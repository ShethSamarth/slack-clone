"use client"

import { cn } from "@/lib/utils"
import { MdOutlineAddReaction } from "react-icons/md"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useCurrentMember } from "@/features/members/api/use-current-member"

import { Hint } from "./hint"
import { EmojiPopover } from "./emoji-popover"

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number
      memberIds: Id<"members">[]
    }
  >
  onChange: (value: string) => void
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId()
  const { data: currentMember } = useCurrentMember({ workspaceId })

  const currentMemberId = currentMember?._id

  if (data.length === 0 || !currentMemberId) return null

  return (
    <div className="my-1 flex items-center gap-1.5">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              "flex h-6 items-center gap-x-1 rounded-lg border border-transparent bg-slate-200/70 px-1 text-slate-800",
              reaction.memberIds.includes(currentMemberId) &&
                "border-blue-500 bg-blue-100/70"
            )}
          >
            {reaction.value}{" "}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.memberIds.includes(currentMemberId) && "text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji)}
      >
        <button className="flex h-6 items-center gap-x-1 rounded-lg border border-transparent bg-slate-200/70 px-2.5 hover:border-slate-500">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  )
}
