import { TransactionCallbacks } from './transaction'
import { AbiItem } from 'web3-utils'

import { TransactionConfig } from 'web3-core'
import { Spells } from './spells'

// ChainId 1 = mainnet, ChainId 137 = matic, 42161 = arbitrum, 43114 = avalanche
export type ChainId = 1 | 42 | 43113

export interface Instance {
  id: number
  address: string
  chainId: ChainId
}

export type claimStkRewardParams = {
  tokens: string
  gasPrice: NonNullable<TransactionConfig['gasPrice']>
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type speedUp = {
  transactionHash: string
  origin?: string
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type closePositionParams = {
  leverageToken: string
  targetToken: string
  direction: number
  unitAmt: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type openPositionParams = {
  leverageToken: string
  targetToken: string
  amountLeverageToken: number
  direction: number
  ratio: number
  unitAmt: number
  rateMode: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type CastParams = {
  spells: Spells
  origin?: string
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type FlashParams = {
  spells: Spells
  token?: string
  amount?: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type openLongParams = {
  leverageToken: string
  targetToken: string
  amountLeverageToken: number
  amountFlashLoan: number
  unitAmt: number
  rateMode: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type closeLongParams = {
  leverageToken: string
  targetToken: string
  amountTargetToken: number
  amountFlashLoan: number
  unitAmt: number
  rateMode: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type cleanLongParams = {
  leverageToken: string
  targetToken: string
  amountFlashLoan: number
  unitAmt: number
  rateMode: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type openShortParams = {
  leverageToken: string
  targetToken: string
  amountTargetToken: number
  amountLeverageToken: number
  amountFlashLoan: number
  unitAmt: number
  rateMode: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type closeShortParams = {
  leverageToken: string
  targetToken: string
  amountTargetToken: number
  amountWithdraw: number
  amountFlashLoan: number
  unitAmt: number
  rateMode: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type cleanShortParams = {
  leverageToken: string
  targetToken: string
  amountWithdraw: number
  amountFlashLoan: number
  unitAmt: number
  rateMode: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type repayParams = {
  repayToken: string
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type withDrawParams = {
  collateralToken: string
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type addMarginParams = {
  collateralToken: string
  amountCollateralToken: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'to' | 'value' | 'gas' | 'gasPrice' | 'nonce'>

export type CreateAccountParams = {
  EOA?: string
  origin?: string
  accountType?: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'gas' | 'gasPrice' | 'nonce'>

export type AccountParams = {
  accountType?: number
} & TransactionCallbacks &
  Pick<TransactionConfig, 'from' | 'gas' | 'gasPrice' | 'nonce'>

export type EstimateGasParams = {
  abi: AbiItem
  args: any
} & Required<Pick<TransactionConfig, 'from' | 'to' | 'value'>>

export interface GetTransactionConfigParams {
  from: NonNullable<TransactionConfig['from']>
  to: NonNullable<TransactionConfig['to']>
  data: NonNullable<TransactionConfig['data']>
  value?: TransactionConfig['value']
  gas?: TransactionConfig['gas']
  gasPrice?: TransactionConfig['gasPrice']
  nonce?: TransactionConfig['nonce']
  onError?: (error: Error) => void
}
