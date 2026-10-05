'use client'

/**
 * OfflineNotice — a word in the lower corner when the connection goes, and
 * another when it comes back.
 *
 * Provenance: original work for this project. No third-party code copied.
 *
 * ## What it is for
 *
 * The site navigates on the client, and with the connection gone a click on
 * a link does what it does on a slow connection: nothing visible, for as long
 * as the reader waits. The page cannot tell the two apart for them, so it
 * says which one this is — "You are offline" — and, when the connection
 * returns, "Back online", which stays long enough to be read and then goes.
 *
 * ## How it is heard
 *
 * The words sit in a `role="status"` region that is always present, so a
 * screen reader announces each change politely and nothing takes focus. The
 * region is empty while the connection is fine; the notice is never in the
 * tab order, because there is nothing to do with it.
 *
 * ## How it moves
 *
 * The pill rises half a gutter into place from `@starting-style`, as the
 * back-to-top chip in the opposite corner does, and "Back online" sinks and
 * fades in the last `--duration` of its hold. Only `transform` and `opacity`.
 * Under reduced motion it is there, or it is not, at once. Without script
 * there is no notice, and the browser's own offline page says the same thing.
 *
 * `offline-notice`.
 */

import cn from 'clsx'
import { type CSSProperties, useSyncExternalStore } from 'react'

import { type Connection, createConnectionStore } from './connection'

import s from './offline-notice.module.css'

/**
 * How long "Back online" stays, in milliseconds: read twice at a glance, then
 * gone. The stylesheet fades it over the end of the same span.
 */
const RESTORED_FOR = 3000

const store = createConnectionStore(() => window, RESTORED_FOR)

/** The server cannot see the reader's connection; a page it served arrived. */
function onlineOnServer(): Connection {
  return 'online'
}

const HOLD_STYLE = { '--hold': `${RESTORED_FOR}ms` } as CSSProperties

interface OfflineNoticeProps {
  /** Already localized — "You are offline". */
  offline: string
  /** Already localized — "Back online". */
  restored: string
}

function messageFor(
  connection: Connection,
  { offline, restored }: OfflineNoticeProps
): string | null {
  switch (connection) {
    case 'offline':
      return offline
    case 'restored':
      return restored
    case 'online':
      return null
  }
}

export function OfflineNotice(props: OfflineNoticeProps) {
  const connection = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    onlineOnServer
  )
  const message = messageFor(connection, props)

  return (
    <div role="status" className={s.region} data-epic="offline-notice">
      {message && (
        <p
          className={cn('caption', s.pill)}
          data-state={connection}
          style={HOLD_STYLE}
        >
          {message}
        </p>
      )}
    </div>
  )
}
