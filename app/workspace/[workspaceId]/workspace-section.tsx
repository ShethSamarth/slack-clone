import { Plus } from "lucide-react"
import { useToggle } from "react-use"
import { FaCaretDown } from "react-icons/fa"

import { cn } from "@/lib/utils"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"

interface WorkspaceSectionProps {
  children: React.ReactNode
  label: string
  hint: string
  onNew?: () => void
}

export const WorkspaceSection = ({
  children,
  label,
  hint,
  onNew
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true)

  return (
    <div className="mt-3 flex flex-col px-2">
      <div className="group flex items-center px-3.5">
        <Button
          onClick={toggle}
          variant="transparent"
          className="size-6 shrink-0 p-0.5 text-sm text-[#F9EDFFCC]"
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", !on && "-rotate-90")}
          />
        </Button>
        <Button
          size="sm"
          variant="transparent"
          className="group h-[28px] items-center justify-start overflow-hidden px-1.5 text-sm text-[#F9EDFFCC]"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              size="iconSm"
              onClick={onNew}
              variant="transparent"
              className="ml-auto size-6 shrink-0 p-0.5 text-sm text-[#F9EDFFCC] opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Plus className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  )
}
