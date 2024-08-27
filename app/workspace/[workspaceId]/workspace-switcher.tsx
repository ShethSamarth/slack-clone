"use client"

import { Loader, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal"

export const WorkspaceSwitcher = () => {
  const router = useRouter()

  const id = useWorkspaceId()
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id
  })

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces()

  const [_open, setOpen] = useCreateWorkspaceModal()

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== id
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative size-9 overflow-hidden bg-[#ABABAD] text-xl font-semibold text-slate-800 hover:bg-[#ABABAD]/80">
          {workspaceLoading ? (
            <Loader className="size-5 shrink-0 animate-spin" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${id}`)}
          className="cursor-pointer flex-col items-start justify-start truncate capitalize"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer truncate capitalize"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="relative mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-lg font-semibold text-white">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            {workspace.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-accent text-lg font-semibold text-slate-800">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
