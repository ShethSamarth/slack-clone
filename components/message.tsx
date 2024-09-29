"use client"

import dynamic from "next/dynamic"
import { format, isToday, isYesterday } from "date-fns"

import { Doc, Id } from "@/convex/_generated/dataModel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Hint } from "./hint"
import { Toolbar } from "./toolbar"
import { Thumbnail } from "./thumbnail"

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false })

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`
}

interface MessageProps {
  id: Id<"messages">
  memberId: Id<"members">
  authorImage?: string
  authorName?: string
  isAuthor: boolean
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number
      memberIds: Id<"members">[]
    }
  >
  body: Doc<"messages">["body"]
  image?: string | null
  createdAt: Doc<"messages">["_creationTime"]
  updatedAt: Doc<"messages">["updatedAt"]
  isEditing: boolean
  isCompact?: boolean
  setEditingId: (id: Id<"messages"> | null) => void
  hideThreadButton?: boolean
  threadCount?: number
  threadImage?: string
  threadTimestamp?: number
}

export const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp
}: MessageProps) => {
  if (isCompact) {
    return (
      <div className="group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="w-10 text-center text-xs leading-5 text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
              {format(createdAt, "hh:mm")}
            </button>
          </Hint>
          <div className="flex w-full flex-col">
            <Renderer value={body} />
            <Thumbnail url={image} />
            {!!updatedAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={() => {}}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    )
  }

  const avatarFallback = authorName.charAt(0).toUpperCase()

  return (
    <div className="group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60">
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage alt={authorName} src={authorImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>
        <div className="flex w-full flex-col overflow-hidden">
          <div className="space-x-2 text-sm">
            <button
              onClick={() => {}}
              className="font-bold text-primary hover:underline"
            >
              {authorName}
            </button>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground hover:underline">
                {format(new Date(createdAt), "h:mm a")}
              </button>
            </Hint>
          </div>
          <Renderer value={body} />
          <Thumbnail url={image} />
          {!!updatedAt && (
            <span className="text-xs text-muted-foreground">(edited)</span>
          )}
        </div>
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleDelete={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  )
}
