import SafeApiKit from '@safe-global/api-kit'

export const apiKit = new SafeApiKit({
  chainId: BigInt(process.env.CHAIN_ID as string),
})

