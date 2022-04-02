import { TransactionConfig } from 'web3-core'
import DSA from '.'
import { Abi } from './abi'
import { Spells } from './spells'
import { wrapIfSpells } from './utils'
import { genesisAddr } from './constant'

type EncodeAbiParams = {
  spells: Spells
  origin?: string
} & Pick<TransactionConfig, 'to'>

export class CastHelpers {

  constructor(private dsa: DSA) {}
  estimateGas = async (
    params: { spells: Spells } & Pick<TransactionConfig, 'from' | 'to' | 'value'>
  ) => {

    const to = params.to ?? this.dsa.instance.address

    if (to === genesisAddr)
      throw new Error(
        `Please configure the DSA instance by calling dsa.setInstance(dsaId). More details: https://docs.instadapp.io/setup`
      )

    const spells  = this.dsa.internal.encodeSpells(params)
    const args = [spells, this.dsa.origin]
    let from = params.from;
    if (!from) {
      const fromFetch = await this.dsa.internal.getAddress()
      from = fromFetch ? fromFetch : ''
    }

    const value = params.value ?? '0'
    
    const abi = this.dsa.internal.getInterface(Abi.op.OpFlash, 'flash')
   
    if (!abi) throw new Error('Abi is not defined.')

    const estimatedGas = await this.dsa.internal.estimateGas({ abi, to, from, value, args })
     
    return estimatedGas     
  }

  encodeABI = (params: Spells | EncodeAbiParams) => {
    const defaults = {
      to: this.dsa.instance.address,
      origin: this.dsa.origin,
    }

    const mergedParams = Object.assign(defaults, wrapIfSpells(params)) as EncodeAbiParams

    if (mergedParams.to === genesisAddr)
      throw new Error(
        `Please configure the DSA instance by calling dsa.setInstance(dsaId). More details: https://docs.instadapp.io/setup`
      )

    const contract = new this.dsa.config.web3.eth.Contract(Abi.op.OpFlash, mergedParams.to)

    const spells = this.dsa.internal.encodeSpells(mergedParams.spells)
    //TODO @thrilok: check about return type.
    const encodedAbi: string = contract.methods.flash(spells, mergedParams.origin).encodeABI()
    return encodedAbi
  }
}
