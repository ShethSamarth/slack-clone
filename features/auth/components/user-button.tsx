"use client"

import { Loader, LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useCurrentUser } from "../api/use-current-user"

export const UserButton = () => {
  const { signOut } = useAuthActions()
  const { data, isLoading } = useCurrentUser()

  if (isLoading)
    return (
      <div className="flex size-10 items-center justify-center rounded-full bg-[#ABABAD]">
        <Loader className="size-4 animate-spin text-slate-800" />
      </div>
    )

  if (!data) return null

  const { name, image } = data

  const avatarFallback = name?.charAt(0).toUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 rounded-md transition hover:opacity-75">
          <AvatarImage alt={name} src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="center" className="w-60">
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
