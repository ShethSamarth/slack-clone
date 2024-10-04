"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

const sidebarItemVariants = cva(
  "flex h-7 items-center justify-start gap-1.5 overflow-hidden px-[18px] text-sm font-normal",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFCC]",
        active: "bg-white text-[#481349] hover:bg-white/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface SidebarItemProps {
  id?: string
  label: string
  icon: LucideIcon | IconType
  variant?: VariantProps<typeof sidebarItemVariants>["variant"]
}

export const SidebarItem = ({
  id,
  label,
  icon: Icon,
  variant
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId()

  return (
    <Button
      asChild
      size="sm"
      variant="transparent"
      className={cn(sidebarItemVariants({ variant }))}
    >
      <Link href={id ? `/workspace/${workspaceId}/channel/${id}` : "#"}>
        <Icon className="mr-1 size-3.5 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  )
}
