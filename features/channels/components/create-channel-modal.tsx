"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

import { useCreateChannel } from "../api/use-create-channel"
import { useCreateChannelModal } from "../store/use-create-channel-modal"

export const CreateChannelModal = () => {
  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useCreateChannelModal()

  const { mutate, isPending } = useCreateChannel()

  const [name, setName] = useState("")

  const handleClose = () => {
    setName("")
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
    setName(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      { name, workspaceId },
      {
        onSuccess: () => {
          // TODO: redirect to channel
          handleClose()
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            required
            autoFocus
            minLength={3}
            maxLength={80}
            value={name}
            onChange={handleChange}
            disabled={isPending}
            placeholder="e.g. plan-budget"
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
