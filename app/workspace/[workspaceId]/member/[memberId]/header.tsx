"use client"

import { FaChevronDown } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  memberName?: string
  memberImage?: string
  onClick?: () => void
}

export const Header = ({
  memberName = "Member",
  memberImage,
  onClick
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase()

  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
      <Button
        size="sm"
        variant="ghost"
        onClick={onClick}
        className="w-auto overflow-hidden px-2 text-lg font-semibold"
      >
        <Avatar className="mr-2 size-6">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="ml-2 size-2.5" />
      </Button>
    </div>
  )
}
