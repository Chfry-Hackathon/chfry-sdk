import Web3 from 'web3'

import { DSAConfig, getDSAConfig } from './config'

import {
  Instance,
  ChainId,
  CreateAccountParams,
  CastParams,
  FlashParams,
  openLongParams,
  closeLongParams,
  cleanLongParams,
  openShortParams,
  closeShortParams,
  cleanShortParams,
  addMarginParams,
  repayParams,
  withDrawParams,
  claimStkRewardParams,
} from './params'

import { genesisAddr, maxUint256 } from './constant'
import { Abi } from './abi'
import { Addresses } from './addresses'
import { CastHelpers } from './cast-helpers'
import { Internal } from './internal'
import { Spells } from './spells'
import { Transaction } from './transaction'
import { wrapIfSpells } from './utils'
import { Erc20 } from './utils/erc20'
import { Erc721 } from './utils/erc721'

export class DSA {
  readonly config: DSAConfig
  origin: string = genesisAddr //all 0 address
  supportChainID: number[] = [1, 42, 43113]
  instance: Instance = {
    id: 0,
    address: genesisAddr,
    chainId: 1,
  }

  public readonly maxValue = maxUint256
  public readonly maxVal = () => maxUint256

  // Extensions
  readonly erc20 = new Erc20(this)
  readonly erc721 = new Erc721(this)
  readonly internal = new Internal(this)
  readonly castHelpers = new CastHelpers(this)
  readonly transaction = new Transaction(this)

  // Aliases
  public encodeSpells = (...args: Parameters<Internal['encodeSpells']>) => this.internal.encodeSpells(...args)
  public sendTransaction = (...args: Parameters<Transaction['send']>) => this.transaction.send(...args)
  public encodeCastABI = (...args: Parameters<CastHelpers['encodeABI']>) => this.castHelpers.encodeABI(...args)
  public estimateCastGas = (...args: Parameters<CastHelpers['estimateGas']>) => {
    return this.castHelpers.estimateGas(...args)
  }

  constructor(config: Web3 | DSAConfig, chainId: ChainId = 1) {
    //Must setup a web3 instance by paramenter, direct or by DSAConfig
    this.instance.chainId = chainId
    // 将config整理成标准格式
    this.config = getDSAConfig(config)
    // 检查 chainId
    this.config.web3.eth.getChainId().then((_chainId) => {
      if (this.instance.chainId != _chainId) {
        throw new Error(`chainId mismatch. set: '${_chainId}' rpc node: '${this.instance.chainId}'`)
      }
      if (!this.supportChainID.includes(chainId)) {
        throw new Error(`chainId '${_chainId}' is not supported.`)
      } else {
        this.instance.chainId = _chainId as ChainId
      }
    })
  }

  get web3() {
    return this.config.web3
  }

  get mode() {
    return this.config.mode
  }

  setOrigin(origin: string) {
    this.origin = origin
  }

  public async refreshChainId() {
    const chainId = (await this.web3.eth.getChainId()) as ChainId
    this.instance.chainId = chainId
  }

  async createAccount(params: CreateAccountParams) {
    const defaultAddress = await this.internal.getAddress()
    const defaults = {
      from: defaultAddress,
      EOA: defaultAddress,
      origin: genesisAddr,
      gasPrice: await this.web3.eth.getGasPrice(),
    }

    const mergedParams = Object.assign(defaults, params) as CreateAccountParams
    const to = Addresses[this.instance.chainId].account.accountIndex
    const contract = new this.web3.eth.Contract(
      Abi.account.accountCenter,
      Addresses[this.instance.chainId].account.accountIndex
    )

    const data = contract.methods.createAccount(params.accountType).encodeABI()
    if (!mergedParams.from) throw new Error("Parameter 'from' is not defined.")

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to,
      data,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })

    return transaction
  }

  public async attachAccount(accountTypeID: number) {
    try {
      const EOA = await this.internal.getAddress()
      const contract = new this.web3.eth.Contract(
        Abi.account.accountCenter,
        Addresses[this.instance.chainId].account.accountIndex
      )
      const address = await contract.methods.getAccount(accountTypeID).call({ from: EOA })
      this.instance.address = address
    } catch (e) {
      console.log('can not attach to smart account, need create first')
      this.instance.address = genesisAddr
    }
  }

  public async getDsaWithTypeID(typeID: number) {
    try {
      const EOA = await this.internal.getAddress()
      const contract = new this.web3.eth.Contract(
        Abi.account.accountCenter,
        Addresses[this.instance.chainId].account.accountIndex
      )
      const address = await contract.methods.getAccount(typeID).call({ from: EOA })
      return address
    } catch (e) {
      console.log('can not attach to smart account, need create first')
      return genesisAddr
    }
  }

  public async getBalance() {
    try {
      const SA: string | undefined = await this.getAccountAddress()
      const balance = await this.web3.eth.getBalance(SA)
      return balance
    } catch (e) {
      return undefined
    }
  }

  public async getGasPrice() {
    return await this.web3.eth.getGasPrice()
  }

  public async getAPYAndAPR(address: string) {
    const reservesList = await this.getReservesList()
    const position = await this.getPosition()
    let data: any = {}
    const RAY = 10 ** 27 // 10 to the power 27
    let index = -1
    for (let i in reservesList) {
      if (address.toLowerCase() == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        const contract = new this.web3.eth.Contract(Abi.basics.erc20, reservesList[i])
        let tokenSymbol = await contract.methods.symbol().call()
        if (tokenSymbol === 'WETH') {
          index = parseInt(i)
          break
        }
      }
      if (reservesList[i].toLowerCase() == address.toLowerCase()) {
        // index = reservesList.indexOf(reservesList[i])
        index = parseInt(i)
        break
      }
    }

    if (index != -1) {
      let tokenData = position[0][index]
      let depositAPR = tokenData['supplyRate'] / RAY
      let depositAPY = await this.getAPY(depositAPR)
      let variableBorrowAPR = tokenData['variableBorrowRate'] / RAY
      let stableBorrowAPR = tokenData['stableBorrowRate'] / RAY
      let variableBorrowAPY = await this.getAPY(variableBorrowAPR)
      let stableBorrowAPY = await this.getAPY(stableBorrowAPR)
      data['depositAPR'] = depositAPR
      data['depositAPY'] = depositAPY
      data['stableBorrowAPR'] = stableBorrowAPR
      data['stableBorrowAPY'] = stableBorrowAPY
      data['variableBorrowAPR'] = variableBorrowAPR
      data['variableBorrowAPY'] = variableBorrowAPY
    }
    return data
  }

  public async listLeverageToken() {
    const contract = new this.web3.eth.Contract(Abi.token.Leverage, Addresses[this.instance.chainId].token.Leverage)
    const result = await contract.methods.listLeverageToken().call()
    let data = []
    for (let i in result) {
      data.push({ id: i, token: result[i]['token'], symbol: result[i]['symbol'] })
    }
    return data
  }

  public async listLongToken() {
    const contract = new this.web3.eth.Contract(Abi.token.Leverage, Addresses[this.instance.chainId].token.Leverage)
    const result = await contract.methods.listLongToken().call()
    let data = []
    for (let i in result) {
      data.push({ id: i, token: result[i]['token'], symbol: result[i]['symbol'] })
    }
    return data
  }

  public async listShortToken() {
    const contract = new this.web3.eth.Contract(Abi.token.Leverage, Addresses[this.instance.chainId].token.Leverage)
    const result = await contract.methods.listShortToken().call()
    let data = []
    for (let i in result) {
      data.push({ id: i, token: result[i]['token'], symbol: result[i]['symbol'] })
    }
    return data
  }

  public async getAaveStackReward() {
    const contract = new this.web3.eth.Contract(
      Abi.resolvers.AaveStakeReward,
      Addresses[this.instance.chainId].aave.AaveStakeReward
    )
    const result = await contract.methods.checkEOAAaveStakeReward().call()
    return result
  }

  public async getReservesList() {
    const EOA = await this.internal.getAddress()
    const contract = new this.web3.eth.Contract(Abi.resolvers.AaveV2, Addresses[this.instance.chainId].resolvers.AaveV2)
    const data = await contract.methods.getReservesList().call({ from: EOA })
    return data
  }

  public async getConfiguration() {
    const EOA = await this.internal.getAddress()
    const contract = new this.web3.eth.Contract(Abi.resolvers.AaveV2, Addresses[this.instance.chainId].resolvers.AaveV2)
    const data = await contract.methods.getConfiguration(this.instance.address).call({ from: EOA })
    return data
  }

  public async getPosition() {
    const EOA = await this.internal.getAddress()
    const contract = new this.web3.eth.Contract(Abi.resolvers.AaveV2, Addresses[this.instance.chainId].resolvers.AaveV2)
    const tokens = await this.getReservesList()
    const data = await contract.methods.getPosition(this.instance.address, tokens).call({ from: EOA })
    return data
  }

  public async getUserData() {
    const position = await this.getPosition()

    let data = []

    let userData = position[1]

    data.push({ id: 0, name: 'COLLATERAL', value: (userData['totalCollateralETH'] * userData['ethPriceInUsd']) / 1e26 })
    data.push({ id: 1, name: 'HEALTH_FACTOR', value: userData['healthFactor'] / 1e18 })
    data.push({ id: 2, name: 'LIQUIDATION_THRESHOLD', value: userData['currentLiquidationThreshold'] / 100 })
    data.push({ id: 3, name: 'TOTAL_ETH', value: userData['totalCollateralETH'] / 1e18 })
    data.push({ id: 4, name: 'BORROWED', value: (userData['totalBorrowsETH'] * userData['ethPriceInUsd']) / 1e26 })
    data.push({ id: 5, name: 'MAX_LTV', value: userData['ltv'] / 100 })
    data.push({
      id: 6,
      name: 'CURRENT_LTV',
      value: (userData['totalBorrowsETH'] / userData['totalCollateralETH']) * 100,
    })
    data.push({ id: 7, name: 'PENDING_STAKAAVE_REWARD', value: userData['pendingRewards'] / 1e18 })

    return data
  }

  public async assetsPriceInETH(token: string) {
    const contract = new this.web3.eth.Contract(Abi.aave.Price, Addresses[this.instance.chainId].aave.Price)
    const price = await contract.methods.getAssetPrice(token).call()
    return price
  }

  public async stkAAVEPriceInETH() {
    const contract = new this.web3.eth.Contract(Abi.aave.Price, Addresses[this.instance.chainId].aave.Price)
    const price = await contract.methods.getAssetPrice('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9').call()
    return price
  }

  public async emissionPerSecond(xtoken: string) {
    const contract = new this.web3.eth.Contract(Abi.aave.Price, Addresses[this.instance.chainId].aave.Incentive)
    const data = await contract.methods.getAssetData(xtoken).call()
    return data
  }

  public async getAtokenData(token: string) {
    const contract = new this.web3.eth.Contract(Abi.aave.Pool, Addresses[this.instance.chainId].aave.Poll)
    const data = await contract.methods.getReserveData(token).call()
    return data
  }

  public async getDeposits() {
    const reservesList = await this.getReservesList()
    const configuration = await this.getConfiguration()
    const position = await this.getPosition()
    const data = []
    const RAY = 10 ** 27 // 10 to the power 27
    let id = 0
    for (let i in configuration['collateral']) {
      if (configuration['collateral'][i]) {
        let userData = position[0][i]
        let tokenData = userData['aaveTokenData']
        let depositAPR = userData['supplyRate'] / RAY
        let depositAPY = await this.getAPY(depositAPR)
        const contract = new this.web3.eth.Contract(Abi.basics.erc20, reservesList[i])
        let tokenSymbol = await contract.methods.symbol().call()
        let decimals = await contract.methods.decimals().call()
        let tokenAddress = reservesList[i]

        if (tokenSymbol === 'WETH') {
          tokenSymbol = 'ETH'
          tokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        }
        const incenticeAPR =
          (tokenData['aEmissionPerSecond'] * 31536000 * tokenData['rewardPriceInEth']) /
          (tokenData['totalATokenSupply'] * userData['tokenPriceInEth'] * Math.pow(10, 18 - tokenData['decimal']))
        let re = {
          id: id,
          deposit: tokenSymbol,
          token: tokenAddress,
          amount: userData['supplyBalance'] / Math.pow(10, decimals),
          value: ((userData['tokenPriceInUsd'] / 1e18) * userData['supplyBalance']) / Math.pow(10, decimals),
          apy: depositAPY,
          apr: depositAPR * 100,
          incentiveAPR: incenticeAPR * 100,
        }
        data.push(re)
        id = id + 1
      }
    }

    return data
  }

  public async getBorrows() {
    const reservesList = await this.getReservesList()
    const configuration = await this.getConfiguration()
    const position = await this.getPosition()
    const data = []
    const RAY = 10 ** 27 // 10 to the power 27
    let id = 0
    for (let i in configuration['borrowed']) {
      if (configuration['borrowed'][i]) {
        let userData = position[0][i]
        let tokenData = userData['aaveTokenData']

        let variableBorrowAPR = userData['variableBorrowRate'] / RAY
        let stableBorrowAPR = userData['stableBorrowRate'] / RAY
        let variableBorrowAPY = await this.getAPY(variableBorrowAPR)
        let stableBorrowAPY = await this.getAPY(stableBorrowAPR)

        const contract = new this.web3.eth.Contract(Abi.basics.erc20, reservesList[i])
        let tokenSymbol = await contract.methods.symbol().call()
        let decimals = await contract.methods.decimals().call()
        let tokenAddress = reservesList[i]
        if (tokenSymbol === 'WETH') {
          tokenSymbol = 'ETH'
          tokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        }

        const incenticeAPR =
          (tokenData['vEmissionPerSecond'] * 31536000 * tokenData['rewardPriceInEth']) /
          (tokenData['totalVariableDebt'] * userData['tokenPriceInEth'] * Math.pow(10, 18 - tokenData['decimal']))

        if (userData['stableBorrowBalance'] > 0) {
          let stableData = {
            id: id,
            borrow: tokenSymbol,
            token: tokenAddress,
            amount: userData['stableBorrowBalance'] / Math.pow(10, decimals),
            value: ((userData['tokenPriceInUsd'] / 1e18) * userData['stableBorrowBalance']) / Math.pow(10, decimals),
            apy: stableBorrowAPY,
            apr: stableBorrowAPR * 100,
            type: 'stable',
          }
          data.push(stableData)
        }

        if (userData['variableBorrowBalance'] > 0) {
          let variableData = {
            id: id,
            borrow: tokenSymbol,
            token: tokenAddress,
            amount: userData['variableBorrowBalance'] / Math.pow(10, decimals),
            value: ((userData['tokenPriceInUsd'] / 1e18) * userData['variableBorrowBalance']) / Math.pow(10, decimals),
            apy: variableBorrowAPY,
            apr: variableBorrowAPR * 100,
            incentiveAPR: incenticeAPR * 100,
            type: 'variable',
          }
          data.push(variableData)
        }
        id = id + 1
      }
    }

    return data
  }

  public async getAPY(apr: number) {
    const SECONDS_PER_YEAR = 31536000
    return parseFloat((((1 + apr / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1) * 100).toFixed(2))
  }

  public async getAccountAddress() {
    return this.instance.address
  }


  async claimStkReward(params: claimStkRewardParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as claimStkRewardParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpStkReward, this.instance.address)
    const data = contract.methods.claimDsaAaveStakeReward(params.tokens).encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })

    return transaction
  }

  async openLong(params: openLongParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as openLongParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpLong, this.instance.address)
    const data = contract.methods
      .openLong(
        params.leverageToken,
        params.targetToken,
        params.amountLeverageToken,
        params.amountFlashLoan,
        params.unitAmt,
        params.rateMode
      )
      .encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })

    return transaction
  }

  async cleanLong(params: cleanLongParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }

    const mergedParams = Object.assign(defaults, params) as cleanLongParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpLong, this.instance.address)
    const data = contract.methods
      .cleanLong(params.leverageToken, params.targetToken, params.amountFlashLoan, params.unitAmt, params.rateMode)
      .encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })

    return transaction
  }

  async closeLong(params: closeLongParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as closeLongParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpShort, this.instance.address)
    const data = contract.methods
      .closeLong(
        params.leverageToken,
        params.targetToken,
        params.amountTargetToken,
        params.amountFlashLoan,
        params.unitAmt,
        params.rateMode
      )
      .encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })

    return transaction
  }

  async openShort(params: openShortParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as openShortParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpShort, this.instance.address)
    const data = contract.methods
      .openShort(
        params.leverageToken,
        params.targetToken,
        params.amountTargetToken,
        params.amountLeverageToken,
        params.amountFlashLoan,
        params.unitAmt,
        params.rateMode
      )
      .encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })

    return transaction
  }

  async closeShort(params: closeShortParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as closeShortParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpShort, this.instance.address)
    const data = contract.methods
      .closeShort(
        params.leverageToken,
        params.targetToken,
        params.amountTargetToken,
        params.amountWithdraw,
        params.amountFlashLoan,
        params.unitAmt,
        params.rateMode
      )
      .encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })

    return transaction
  }

  async cleanShort(params: cleanShortParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as cleanShortParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpShort, this.instance.address)
    const data = contract.methods
      .cleanShort(
        params.leverageToken,
        params.targetToken,
        params.amountWithdraw,
        params.amountFlashLoan,
        params.unitAmt,
        params.rateMode
      )
      .encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })

    return transaction
  }

  async addMargin(params: addMarginParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as addMarginParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpLong, this.instance.address)
    const data = contract.methods.addMargin(params.collateralToken, params.amountCollateralToken).encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })
    return transaction
  }

  async repay(params: repayParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as repayParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpLong, this.instance.address)
    const data = contract.methods.repay(params.repayToken).encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })
    return transaction
  }

  async withdraw(params: withDrawParams) {
    const defaults = {
      to: this.instance.address,
      from: await this.internal.getAddress(),
      gasPrice: await this.web3.eth.getGasPrice(),
    }
    const mergedParams = Object.assign(defaults, params) as withDrawParams
    if (!mergedParams.from) throw new Error(`Parameter 'from' is not defined.`)
    if (!mergedParams.to) throw new Error(`Parameter 'to' is not defined.`)
    const contract = new this.web3.eth.Contract(Abi.op.OpLong, this.instance.address)
    const data = contract.methods.withdraw(params.collateralToken).encodeABI()

    const transactionConfig = await this.internal.getTransactionConfig({
      from: mergedParams.from,
      to: mergedParams.to,
      gas: mergedParams.gas,
      gasPrice: await this.transaction.adjustGasPirce(mergedParams.gasPrice),
      nonce: mergedParams.nonce,
      value: mergedParams.value,
      data: data,
    })

    const transaction = await this.transaction.send(transactionConfig, {
      onReceipt: mergedParams.onReceipt,
      onConfirmation: mergedParams.onConfirmation,
      onError: mergedParams.onError,
    })
    return transaction
  }
}
