import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChannelHeroProps {
  name: string
  image?: string
}

export const ConversationHero = ({ name, image }: ChannelHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase()

  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <div className="mb-2 flex items-center gap-x-1">
        <Avatar className="mr-2 size-14">
          <AvatarImage src={image} />
          <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{name}</p>
      </div>

      <p>
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  )
}
