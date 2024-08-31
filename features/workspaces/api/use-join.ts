import { useMutation } from "convex/react"
import { useCallback, useMemo, useState } from "react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

type RequestType = { workspaceId: Id<"workspaces">; joinCode: string }
type ResponseType = Id<"workspaces"> | null

type Options = {
  onSuccess?: (data: ResponseType) => void
  onError?: (error: Error) => void
  onSettled?: () => void
  throwError?: boolean
}

export const useJoin = () => {
  const [data, setData] = useState<ResponseType>(null)
  const [status, setStatus] = useState<"settled" | "pending" | null>(null)

  const isPending = useMemo(() => status === "pending", [status])
  const isSettled = useMemo(() => status === "settled", [status])

  const mutation = useMutation(api.workspaces.join)

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null)
        setStatus("pending")

        const response = await mutation(values)
        options?.onSuccess?.(response)

        return response
      } catch (error) {
        options?.onError?.(error as Error)

        if (options?.throwError) throw error
      } finally {
        setStatus("settled")
        options?.onSettled?.()
      }
    },
    [mutation]
  )

  return { mutate, data, isPending, isSettled }
}
