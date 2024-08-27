interface WorkspaceIdProps {
  params: { workspaceId: string }
}

const WorkspaceId = ({ params }: WorkspaceIdProps) => {
  return <div>{params.workspaceId}</div>
}

export default WorkspaceId
