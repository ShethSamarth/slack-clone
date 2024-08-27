"use client"

import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"

const WorkspaceId = () => {
  const id = useWorkspaceId()
  const { data } = useGetWorkspace({ id })

  return <div>{id}</div>
}

export default WorkspaceId
