import { TransactionConfig } from 'web3-core'
import { AbiItem } from 'web3-utils'
import DSA from '.'
import { Abi } from './abi'

import { Addresses } from './addresses'
import { TokenInfo } from './data/token-info'
import { EstimatedGasException, EstimatedGasException2 } from './exceptions/estimated-gas-exception'
import { Spells } from './spells'
import { hasKey } from './utils/typeHelper'

import { GetTransactionConfigParams, EstimateGasParams } from './params'
import { Connector } from "./abi/connectors";

export type PackedSpell = {
  name: Connector | void
  data: string
}

export class Internal {

  constructor(private dsa: DSA) { }

  encodeSpells = (params: Spells | { spells: Spells }) => {

    let spells = this.getSpells(params)
    const targets = spells.data.map((spell) => this.getTarget(spell.connector))
    const encodedMethods = spells.data.map((spell) => this.encodeMethod(spell))
    const spell_array: PackedSpell[] = []

    for (let spell of spells.data) {
      let packedSpell: PackedSpell =
      {
        name: this.getTarget(spell.connector),
        data: this.encodeMethod(spell)
      }

      spell_array.push(packedSpell)
    }

    return spell_array

  }


  private getSpells = (params: Spells | { spells: Spells }) => {
    return params instanceof Spells ? params : params.spells
  }

  private getTarget = (connector: Connector) => {

    const chainId = this.dsa.instance.chainId;

    // type check that object has the required properties
    if (!hasKey(Addresses[chainId].conncetors, connector)) {
      return console.error(`${connector} is invalid connector.`)
    }

    const target = Addresses[chainId].conncetors[connector]

    if (!target) return console.error(`${connector} is invalid connector.`)

    // return target address for version 1 and connector name for version 2
    return connector
  }

  encodeMethod = (
    params: { connector: Connector; method: string; args: string[] },
  ) => {
    // type check that object has the required properties
    if (!(hasKey(Abi.connectors, params.connector))) {
      throw new Error(`ConnectorInterface '${params.method}' not found`)
    }

    const connectorInterface = this.getInterface(Abi.connectors[params.connector], params.method)

    if (!connectorInterface) throw new Error(`ConnectorInterface '${params.method}' not found`)

    return this.dsa.web3.eth.abi.encodeFunctionCall(connectorInterface, params.args)
  }

  getInterface = (abiItems: AbiItem[], method: string) => {
    const abiItem = abiItems.find((abiItem) => abiItem.name === method)

    if (!abiItem) {
      console.error(`${method} is an invalid method.`)
      return
    }

    return abiItem
  }

  getTransactionConfig =
    async (params: GetTransactionConfigParams) => {
      if (!params.from) throw new Error("Parameter 'from' is not defined.")
      if (!params.to) throw new Error("Parameter 'to' is not defined.")
      if (!params.data) throw new Error("Parameter 'data' is not defined.")

      const from = params.from
      const to = params.to
      const data = params.data !== '0x' ? params.data : '0x'
      const value = params.value ?? 0

      const gas = params.gas ?? (await this.getGas({ from, to, data, value }))
      const transactionConfig: TransactionConfig = { from, to, data, value, gas }

      if (params.gasPrice) {
        transactionConfig.gasPrice = params.gasPrice
      }

      if (this.dsa.mode === 'node') {
        if (!params.gasPrice) throw new Error("Parameter 'gasPrice' must be defined when using mode 'node'.")

        transactionConfig.nonce = params.nonce ?? (await this.getNonce(from))
      } else if (!!params.nonce) {
        transactionConfig.nonce = params.nonce
      }

      return transactionConfig
    }

  getAddress = async () => {
    if (this.dsa.config.mode == "node")
      return this.dsa.web3.eth.accounts.privateKeyToAccount(this.dsa.config.privateKey)
        .address;
    else if (this.dsa.config.mode == "simulation")
      return this.dsa.config.publicKey

    // otherwise, browser
    const addresses = await this.dsa.web3.eth.getAccounts()

    if (!addresses.length) {
      console.log('No ethereum address detected.')
      return
    }

    return addresses[0]
  }

  /**
   * Returns the address from token key OR checksum the address if not.
   */
  filterAddress = (token: keyof typeof TokenInfo | string) => {
    var isAddress = this.dsa.web3.utils.isAddress(token.toLowerCase())
    if (isAddress) {
      return this.dsa.web3.utils.toChecksumAddress(token.toLowerCase())
    } else {
      const info = TokenInfo[token as keyof typeof TokenInfo]

      if (!info) throw new Error("'token' symbol not found.")

      return this.dsa.web3.utils.toChecksumAddress(info.address)
    }
  }

  estimateGas = async (params: EstimateGasParams) => {
    const data = this.dsa.web3.eth.abi.encodeFunctionCall(params.abi, params.args)
    try {
      const estimatedGas = await this.dsa.web3.eth.estimateGas({
        from: params.from,
        to: params.to,
        data: data,
        value: params.value,
      })

      return estimatedGas
    } catch (error: any) {
      throw new EstimatedGasException(error, { ...params, data })
    }
  }

  private getNonce = async (from: string | number) => {
    return await this.dsa.web3.eth.getTransactionCount(String(from))
  }


  private getGas = async (transactionConfig: TransactionConfig) => {
    // return 3000000
    return ((await this.dsa.web3.eth.estimateGas(transactionConfig)) * 1.1).toFixed(0) // increasing gas cost by 10% for margin
  }

  private estimateGasCallback = (error: Error, gas: number) => {
    console.log("==================================")
    // console.log(error)
    console.log(gas)
  }

}

