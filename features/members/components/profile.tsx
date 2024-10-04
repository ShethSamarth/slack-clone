"use client"

import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AlertTriangle, ChevronDown, Loader, Mail, X } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"
import { Id } from "@/convex/_generated/dataModel"
import { Separator } from "@/components/ui/separator"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useGetMember } from "../api/use-get-member"
import { useRemoveMember } from "../api/use-remove-member"
import { useUpdateMember } from "../api/use-update-member"
import { useCurrentMember } from "../api/use-current-member"

interface ProfileProps {
  memberId: Id<"members">
  onClose: () => void
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change role",
    "Are you sure you want to change this member's role ?"
  )

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace ?"
  )

  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member ?"
  )

  const { data: currentMember, isLoading: currentMemberLoading } =
    useCurrentMember({ workspaceId })

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId
  })

  const { mutate: updateMember, isPending: updatingMember } = useUpdateMember()
  const { mutate: removeMember, isPending: removingMember } = useRemoveMember()

  const onRemove = async () => {
    const ok = await confirmRemove()

    if (!ok) return

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          onClose()
          toast.success("Member removed")
        },
        onError: () => toast.error("Failed to remove member")
      }
    )
  }

  const onLeave = async () => {
    const ok = await confirmLeave()

    if (!ok) return

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          onClose()
          router.replace("/")
          toast.success("You left the workspace")
        },
        onError: () => toast.error("Failed to leave the workspace")
      }
    )
  }

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate()

    if (!ok) return

    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => toast.success("Role changed"),
        onError: () => toast.error("Failed to change role")
      }
    )
  }

  if (memberLoading || currentMemberLoading) {
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
    <>
      <LeaveDialog />
      <RemoveDialog />
      <UpdateDialog />

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
          {currentMember?.role === "admin" && currentMember._id !== memberId ? (
            <div className="mt-4 flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full capitalize">
                    {member.role} <ChevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="w-full" onClick={onRemove}>
                Remove
              </Button>
            </div>
          ) : (
            currentMember?._id === memberId &&
            currentMember.role !== "admin" && (
              <div className="mt-4" onClick={onLeave}>
                <Button variant="outline" className="w-full">
                  Leave
                </Button>
              </div>
            )
          )}
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
    </>
  )
}
