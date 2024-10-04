"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Info, Search } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"

export const Toolbar = () => {
  const router = useRouter()

  const workspaceId = useWorkspaceId()

  const { data } = useGetWorkspace({ id: workspaceId })
  const { data: members } = useGetMembers({ workspaceId })
  const { data: channels } = useGetChannels({ workspaceId })

  const [open, setOpen] = useState<boolean>(false)

  const onChannelRoute = (channelId: string) => {
    router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    setOpen(false)
  }

  const onMemberRoute = (memberId: string) => {
    router.push(`/workspace/${workspaceId}/member/${memberId}`)
    setOpen(false)
  }

  return (
    <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
      <div className="flex-1" />

      <div className="min-w-[280px] max-w-[642px] shrink grow-[2]">
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25"
        >
          <Search className="mr-2 size-4 text-white" />
          <span className="text-xs text-white">Search {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList className="messages-scrollbar">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelRoute(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberRoute(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  )
}
