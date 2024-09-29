/* eslint-disable @next/next/no-img-element */
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ThumbnailProps {
  url?: string | null
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative my-2 max-w-[360px] cursor-zoom-in overflow-hidden rounded-lg border">
          <img
            src={url}
            alt="Message Image"
            className="size-full rounded-md object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-screen border-none bg-transparent p-0 shadow-none">
        <img
          src={url}
          alt="Message Image"
          className="size-full rounded-md object-cover"
        />
      </DialogContent>
    </Dialog>
  )
}
