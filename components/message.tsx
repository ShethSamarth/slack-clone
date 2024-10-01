"use client"

import { toast } from "sonner"
import dynamic from "next/dynamic"
import { format, isToday, isYesterday } from "date-fns"

import { cn } from "@/lib/utils"
import { useConfirm } from "@/hooks/use-confirm"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRemoveMessage } from "@/features/messages/api/use-remove-message"
import { useUpdateMessage } from "@/features/messages/api/use-update-message"

import { Hint } from "./hint"
import { Toolbar } from "./toolbar"
import { Thumbnail } from "./thumbnail"

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })
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
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message ? This cannot be undone."
  )

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage()

  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage()

  const isPending = isUpdatingMessage || isRemovingMessage

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated")
          setEditingId(null)
        },
        onError: () => toast.error("Failed to update message")
      }
    )
  }

  const handleRemove = async () => {
    const ok = await confirm()

    if (!ok) return

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted")

          // TODO: close thread if open
        },
        onError: () => toast.error("Failed to delete message")
      }
    )
  }

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-500"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="w-10 text-center text-xs leading-5 text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                {format(createdAt, "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="size-full">
                <Editor
                  variant="update"
                  disabled={isPending}
                  onSubmit={handleUpdate}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="flex w-full flex-col">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {!!updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                )}
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
              handleDelete={handleRemove}
              handleReaction={() => {}}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    )
  }

  const avatarFallback = authorName.charAt(0).toUpperCase()

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage alt={authorName} src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="size-full">
              <Editor
                variant="update"
                disabled={isPending}
                onSubmit={handleUpdate}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
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
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={handleRemove}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  )
}
