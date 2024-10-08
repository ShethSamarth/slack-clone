"use client"

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal
} from "lucide-react"

import { useMemberId } from "@/hooks/use-member-id"
import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal"

import { UserItem } from "./user-item"
import { SidebarItem } from "./sidebar-item"
import { WorkspaceHeader } from "./workspace-header"
import { WorkspaceSection } from "./workspace-section"

export const WorkspaceSidebar = () => {
  const memberId = useMemberId()
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const [_, setOpen] = useCreateChannelModal()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId
  })
  const { data: channels } = useGetChannels({ workspaceId })
  const { data: members } = useGetMembers({ workspaceId })

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5F]">
        <Loader className="size-6 animate-spin text-white" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-[#5E2C5F]">
        <AlertTriangle className="size-6 text-white" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="mt-3 flex flex-col px-2">
        <SidebarItem label="Threads" icon={MessageSquareText} />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            id={item._id}
            label={item.name}
            icon={HashIcon}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct Messages" hint="New direct message">
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={memberId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  )
}
