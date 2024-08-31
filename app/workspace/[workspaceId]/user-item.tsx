"use client"

import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Id } from "@/convex/_generated/dataModel"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const userItemVariants = cva(
  "flex h-7 items-center justify-start gap-1.5 overflow-hidden px-4 text-sm font-normal",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFCC]",
        active: "bg-white text-[#481349] hover:bg-white/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface UserItemProps {
  id: Id<"members">
  label?: string
  image?: string
  variant?: VariantProps<typeof userItemVariants>["variant"]
}

export const UserItem = ({
  id,
  label = "Member",
  image,
  variant
}: UserItemProps) => {
  const workspaceId = useWorkspaceId()

  const avatarFallback = label.charAt(0).toUpperCase()

  return (
    <Button
      asChild
      size="sm"
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="mr-1 size-5 rounded-md">
          <AvatarImage alt={label} src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  )
}
