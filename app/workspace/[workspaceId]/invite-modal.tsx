import { toast } from "sonner"
import { Copy, RefreshCcw } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/hooks/use-confirm"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code"

interface InviteModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  name: string
  joinCode: string
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId()

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "This will deactivate the current invite code and generate a new one."
  )

  const { mutate, isPending } = useNewJoinCode()

  const handleNewCode = async () => {
    const ok = await confirm()

    if (!ok) return

    mutate(
      { workspaceId },
      {
        onSuccess: () => toast.success("New join code generated"),
        onError: () => toast.error("Failed to regenerate invite code")
      }
    )
  }

  const handleCopy = () => {
    const inviteLink = `${location.origin}/join/${workspaceId}`

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"))
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold uppercase tracking-widest">
              {joinCode}
            </p>
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              Copy Link
              <Copy className="ml-2 size-4" />
            </Button>
          </div>
          <div className="flex w-full items-center justify-between">
            <Button type="button" disabled={isPending} onClick={handleNewCode}>
              New code{" "}
              <RefreshCcw
                className={cn("ml-2 size-4", isPending && "animate-spin")}
              />
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
