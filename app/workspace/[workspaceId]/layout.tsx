import { Sidebar } from "./sidebar"
import { Toolbar } from "./toolbar"

const WorkspaceIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-2.5rem)]">
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default WorkspaceIdLayout
