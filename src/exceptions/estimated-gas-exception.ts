import { EstimateGasParams } from '../params'

export class EstimatedGasException extends Error {
  constructor(public error: Error, public data: { data: string } & EstimateGasParams) {
    super(error.message)
  }
}

export class EstimatedGasException2 extends Error {
  constructor(public error: Error) {
    super(error.message)
  }
}
