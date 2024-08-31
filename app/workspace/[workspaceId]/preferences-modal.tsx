"use client"

import { toast } from "sonner"
import { Trash } from "lucide-react"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

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
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace"
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace"

interface PreferencesModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  initialValue: string
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue
}: PreferencesModalProps) => {
  const router = useRouter()

  const id = useWorkspaceId()

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "This action is irreversible."
  )

  const [value, setValue] = useState(initialValue)
  const [editOpen, setEditOpen] = useState(false)

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace()

  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace()

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateWorkspace(
      { id, name: value },
      {
        onSuccess: () => {
          toast.success("Workspace updated")
          setEditOpen(false)
        },
        onError: () => toast.error("Failed to update workspace")
      }
    )
  }

  const handleRemove = async () => {
    const ok = await confirm()

    if (!ok) return

    removeWorkspace(
      { id },
      {
        onSuccess: () => {
          router.replace("/")
          toast.success("Workspace removed")
        },
        onError: () => toast.error("Failed to remove workspace")
      }
    )
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm font-semibold text-[#1264A3] hover:underline">
                      Edit
                    </p>
                  </div>
                  <p>{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Workspace name e.g. Work, Personal, Home"
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isUpdatingWorkspace}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              onClick={handleRemove}
              disabled={isRemovingWorkspace}
              className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
