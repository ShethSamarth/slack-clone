"use client"

import { toast } from "sonner"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useCreateWorkspace } from "../api/use-create-workspace"
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"

export const CreateWorkspaceModal = () => {
  const router = useRouter()

  const [open, setOpen] = useCreateWorkspaceModal()
  const [name, setName] = useState("")

  const { mutate, isPending } = useCreateWorkspace()

  const handleClose = () => {
    setOpen(false)
    setName("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      { name },
      {
        onSuccess: (id) => {
          toast.success("Workspace created")
          router.push(`/workspace/${id}`)
          handleClose()
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            required
            autoFocus
            minLength={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            placeholder="Workspace name e.g. Work, Personal, Home"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
