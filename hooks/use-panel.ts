import { useProfileMemberId } from "@/features/members/store/use-profile-member-id"
import { useParentMessageId } from "@/features/messages/store/use-parent-message-id"

export const usePanel = () => {
  const [profileMemberId, setProfileMemberId] = useProfileMemberId()
  const [parentMessageId, setParentMessageId] = useParentMessageId()

  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId)
    setParentMessageId(null)
  }

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId)
    setProfileMemberId(null)
  }

  const onClose = () => {
    setProfileMemberId(null)
    setParentMessageId(null)
  }

  return {
    profileMemberId,
    onOpenProfile,
    parentMessageId,
    onOpenMessage,
    onClose
  }
}
