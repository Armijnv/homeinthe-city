/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path are handled by this file using Next.js catch-all routes.
 */

import config from '../../../sanity.config'
import StudioClient from './StudioClient'

export const dynamic = 'force-dynamic'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <StudioClient config={config} />
}
