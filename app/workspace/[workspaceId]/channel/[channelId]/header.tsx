"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { FaChevronDown } from "react-icons/fa"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"
import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useUpdateChannel } from "@/features/channels/api/use-update-channel"
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel"

interface HeaderProps {
  title: string
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter()

  const id = useChannelId()
  const workspaceId = useWorkspaceId()

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel ?",
    "This action cannot be undone."
  )

  const [value, setValue] = useState(title)
  const [editOpen, setEditOpen] = useState(false)

  const { data: member } = useCurrentMember({ workspaceId })
  const { mutate: updateChannel, isPending: updatingChannel } =
    useUpdateChannel()
  const { mutate: removeChannel, isPending: removingChannel } =
    useRemoveChannel()

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return

    setEditOpen(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
    setValue(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateChannel(
      { id, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated")
          setEditOpen(false)
        },
        onError: () => toast.error("Failed to update channel")
      }
    )
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    removeChannel(
      { id },
      {
        onSuccess: () => {
          toast.success("Channel deleted")
          router.push(`/workspace/${workspaceId}`)
        },
        onError: () => toast.error("Failed to delete channel")
      }
    )
  }

  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="w-auto overflow-hidden px-2 text-lg font-semibold"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="ml-2 size-2.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-xs font-semibold text-[#1264A3] hover:underline">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    value={value}
                    onChange={handleChange}
                    disabled={updatingChannel}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={updatingChannel}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={updatingChannel}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handleDelete}
                className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
              >
                <Trash className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
