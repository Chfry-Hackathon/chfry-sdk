import { TransactionConfig, TransactionReceipt } from 'web3-core'
import { DSA } from './dsa'
import { genesisAddr } from "./constant"
import BN from 'bn.js'

export interface TransactionCallbacks {
  onReceipt?: (receipt: TransactionReceipt) => void
  onConfirmation?: (confirmationNumber: number, receipt: TransactionReceipt, latestBlockHash?: string) => void
  onError?: (error: Error) => void
  onEstimateGasError?: (error: Error) => void
}

export class Transaction {
  constructor(private dsa: DSA) { }
  send =
    async (transactionConfig: TransactionConfig, transactionCallbacks: TransactionCallbacks = {}): Promise<string> => {
      return new Promise(
        async (resolve, reject) => {
          if (transactionConfig.to == genesisAddr)
            throw Error(
              `Please attach DSA first`
            )
          if (this.dsa.config.mode == 'node') {
            const signedTransaction = await this.dsa.web3.eth.accounts.signTransaction(
              transactionConfig,
              this.dsa.config.privateKey
            )
            if (!signedTransaction.rawTransaction)
              throw new Error('Error while signing transaction')
            this.dsa.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
              .on("transactionHash", (txHash) => {
                resolve(txHash);
                return txHash;
              })
              .on("receipt", (receipt) => {
                transactionCallbacks.onReceipt && transactionCallbacks.onReceipt(receipt);
              })
              .on("confirmation", (confirmationNumber, receipt, latestBlockHash) => {
                transactionCallbacks.onConfirmation && transactionCallbacks.onConfirmation(confirmationNumber, receipt, latestBlockHash);
              })
              .on("error", (error) => {
                transactionCallbacks.onError && transactionCallbacks.onError(error);
                reject(error);
                return;
              });
          }
          else {
            this.dsa.web3.eth.sendTransaction(transactionConfig)
              .on("transactionHash", (txHash) => {
                resolve(txHash);
                return txHash;
              })
              .on("receipt", (receipt) => {
                transactionCallbacks.onReceipt && transactionCallbacks.onReceipt(receipt);
              })
              .on("confirmation", (confirmationNumber, receipt, latestBlockHash) => {
                transactionCallbacks.onConfirmation && transactionCallbacks.onConfirmation(confirmationNumber, receipt, latestBlockHash);
              })
              .on("error", (error) => {
                transactionCallbacks.onError && transactionCallbacks.onError(error);
                reject(error);
                return;
              }
              );
          }
        })
    }

  cancel = async (params: Required<Pick<TransactionConfig, 'nonce' | 'gasPrice'>>) => {
    if (!params.nonce) throw new Error("Parameter 'nonce' not defined.")
    if (!params.gasPrice) throw new Error("Parameter 'gasPrice' not defined.")
    const userAddress = await this.dsa.internal.getAddress()
    const transactionConfig: TransactionConfig = {
      from: userAddress,
      to: userAddress,
      value: 0,
      data: '0x',
      gasPrice: params.gasPrice,
      gas: '27500',
      nonce: params.nonce,
    }
    const transactionHash = await this.send(transactionConfig)
    return transactionHash
  }

  speedUp = async (
    dsa: DSA,
    params: { transactionHash: string; gasPrice: NonNullable<TransactionConfig['gasPrice']> }
  ) => {
    if (!params.transactionHash) throw new Error("Parameter 'transactionHash' is not defined.")
    if (!params.gasPrice) throw new Error("Parameter 'gasPrice' is not defined.")

    const userAddress = await this.dsa.internal.getAddress()

    if (!userAddress) throw new Error('User address is not defined.')

    const transaction = await this.dsa.web3.eth.getTransaction(params.transactionHash)

    if (transaction.from.toLowerCase() !== userAddress.toLowerCase()) throw new Error("'from' address doesnt match.")

    const gasPrice = typeof params.gasPrice !== 'number' ? params.gasPrice : params.gasPrice.toFixed(0)

    const transactionConfig: TransactionConfig = {
      from: transaction.from,
      to: transaction.to ?? undefined,
      value: transaction.value,
      data: transaction.input,
      gasPrice: gasPrice,
      gas: transaction.gas,
      nonce: transaction.nonce,
    }

    const transactionHash = await this.send(transactionConfig)
    return transactionHash
  }

  getNonce = async (transactionHash: string) => {
    const transaction = await this.dsa.web3.eth.getTransaction(transactionHash)
    return transaction.nonce
  }

  getTransactionCount = async (address: string) => {
    const transactionCount = await this.dsa.web3.eth.getTransactionCount(address)
    return transactionCount
  }

  adjustGasPirce = async (gasPrice: string | number | BN | undefined) => {
    let adjustGasPirce: BN
    if (typeof gasPrice === 'undefined') {
      adjustGasPirce = new BN(await this.dsa.web3.eth.getGasPrice())
    } else {
      adjustGasPirce = new BN(gasPrice)
    }
    adjustGasPirce = adjustGasPirce.add(new BN(10 ** 9 * 3)) // add 2 more Gwei
    return adjustGasPirce
  }
}
