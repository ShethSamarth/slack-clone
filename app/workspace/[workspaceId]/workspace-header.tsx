import { ChevronDown, ListFilter, SquarePen } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Doc } from "@/convex/_generated/dataModel"
import { Hint } from "@/components/hint"

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">
  isAdmin: boolean
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin
}: WorkspaceHeaderProps) => {
  return (
    <div className="flex h-[49px] items-center justify-between gap-0.5 px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="transparent"
            className="w-auto overflow-hidden p-1.5 text-lg font-semibold"
          >
            <span className="truncate">{workspace.name}</span>
            <ChevronDown className="ml-1 size-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start" className="w-64">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="relative mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-xl font-semibold text-white">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex w-auto flex-col overflow-hidden">
              <p className="truncate font-bold">{workspace.name}</p>
              <p className="text-xs text-muted-foreground">Active workspace</p>
            </div>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {}}
                className="cursor-pointer py-2"
              >
                <p className="truncate">Invite people {workspace.name}</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {}}
                className="cursor-pointer py-2"
              >
                Preferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-0.5">
        <Hint label="Filter conversations" side="bottom">
          <Button size="iconSm" variant="transparent">
            <ListFilter className="size-4" />
          </Button>
        </Hint>
        <Hint label="New message" side="bottom">
          <Button size="iconSm" variant="transparent">
            <SquarePen className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  )
}
