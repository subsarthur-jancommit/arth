import { CheckmarkIcon } from '@sanity/icons/Checkmark'
import { PublishIcon } from '@sanity/icons/Publish'
import { useCurrentUser, useDocumentOperation, userHasRole } from 'sanity'
import type { DocumentActionComponent } from 'sanity'

declare module 'sanity' {
  interface DocumentActionKeys {
    approveArthurDocument: never
  }
}

const ARTHUR_CONTENT_TYPES = new Set([
  'siteSettings',
  'unit',
  'side',
  'bab',
  'offer',
  'sequence',
  'howWeWork',
  'faq',
  'page',
])

export function isArthurContentType(type: string): boolean {
  return ARTHUR_CONTENT_TYPES.has(type)
}

function useOwnerRole(): boolean {
  const currentUser = useCurrentUser()
  // The Studio has no project-specific owner identifier in source control.
  // Administrator is the narrowest built-in role that can own publication;
  // the cost is that a future second administrator would share this power.
  return userHasRole(currentUser, 'administrator')
}

export const ApproveArthurDocumentAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type)
  const isOwner = useOwnerRole()
  const isReady = props.draft !== null && props.draft !== undefined
  const status = props.draft?.statusTinjauan

  return {
    label: 'Setujui',
    icon: CheckmarkIcon,
    disabled:
      !isOwner ||
      !isReady ||
      status === 'disetujui' ||
      patch.disabled !== false,
    onHandle: () => {
      if (!isOwner || !isReady || patch.disabled !== false) return

      patch.execute([
        {
          set: {
            statusTinjauan: 'disetujui',
            tanggalDisetujui: new Date().toISOString().slice(0, 10),
          },
        },
      ])
      props.onComplete()
    },
  }
}

ApproveArthurDocumentAction.action = 'approveArthurDocument'

export const PublishApprovedArthurDocumentAction: DocumentActionComponent = (
  props
) => {
  const { publish } = useDocumentOperation(props.id, props.type)
  const isOwner = useOwnerRole()
  const status = props.draft?.statusTinjauan
  const isApproved = status === 'disetujui'

  return {
    label: 'Terbitkan',
    icon: PublishIcon,
    disabled: !isOwner || !isApproved || publish.disabled !== false,
    onHandle: () => {
      if (!isOwner || !isApproved || publish.disabled !== false) return

      publish.execute()
      props.onComplete()
    },
  }
}

PublishApprovedArthurDocumentAction.action = 'publish'
