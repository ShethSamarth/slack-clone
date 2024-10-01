"use client"

import { Loader } from "lucide-react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable"
import { usePanel } from "@/hooks/use-panel"
import { Id } from "@/convex/_generated/dataModel"
import { Thread } from "@/features/messages/components/thread"

import { Sidebar } from "./sidebar"
import { Toolbar } from "./toolbar"
import { WorkspaceSidebar } from "./workspace-sidebar"

const WorkspaceIdLayout = ({ children }: { children: React.ReactNode }) => {
  const { parentMessageId, onCloseMessage } = usePanel()

  const showPanel = !!parentMessageId

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-2.5rem)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="stack-workspace-layout"
        >
          <ResizablePanel
            minSize={11}
            defaultSize={20}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={showPanel ? 50 : 80}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={30}>
                {parentMessageId ? (
                  <Thread
                    onClose={onCloseMessage}
                    messageId={parentMessageId as Id<"messages">}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceIdLayout
