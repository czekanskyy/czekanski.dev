import { getPayload } from 'payload'
import config from '@/payload.config'

export const getPayloadClient = async () => {
  const awaitedConfig = await config
  return getPayload({ config: awaitedConfig })
}
