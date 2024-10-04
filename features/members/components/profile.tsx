"use client"

import Link from "next/link"
import { AlertTriangle, Loader, Mail, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Id } from "@/convex/_generated/dataModel"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useGetMember } from "../api/use-get-member"

interface ProfileProps {
  memberId: Id<"members">
  onClose: () => void
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId
  })

  if (memberLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] shrink-0 items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Profile</p>

          <Button onClick={onClose} size="iconSm" variant="ghost">
            <X className="size-5 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] shrink-0 items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Profile</p>

          <Button onClick={onClose} size="iconSm" variant="ghost">
            <X className="size-5 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex h-full flex-col items-center justify-center gap-y-2">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Member not found</p>
        </div>
      </div>
    )
  }

  const avatarFallback = member.user.name?.charAt(0).toUpperCase() ?? "M"

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] shrink-0 items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Profile</p>

        <Button onClick={onClose} size="iconSm" variant="ghost">
          <X className="size-5 stroke-[1.5]" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="size-full max-h-64 max-w-64">
          <AvatarImage src={member.user.image} />
          <AvatarFallback className="aspect-square text-6xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{member.user.name}</p>
      </div>

      <Separator />

      <div className="flex flex-col p-4">
        <p className="mb-4 text-sm font-bold">Contact information</p>

        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-muted">
            <Mail className="size-4" />
          </div>

          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm text-[#1264A3] hover:underline"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
