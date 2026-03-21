import { PayloadSDK } from '@payloadcms/sdk'

import type { Config } from '@/payload-types'
import { getClientSideURL } from '@/lib/getURL'

let sdk: PayloadSDK<Config> | undefined

export const getPayloadSdk = () => {
  if (!sdk) {
    sdk = new PayloadSDK<Config>({
      baseInit: {
        credentials: 'include',
      },
      baseURL: `${getClientSideURL()}/api`,
    })
  }

  return sdk
}
