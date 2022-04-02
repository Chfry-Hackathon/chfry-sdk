import { AbiItem } from 'web3-utils'

export const OpLong: AbiItem[] = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_opCenterAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_lender",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "collateralToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountCollateralToken",
        "type": "uint256"
      }
    ],
    "name": "addMargin",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "leverageToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "targetToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountFlashLoan",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "unitAmt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rateMode",
        "type": "uint256"
      }
    ],
    "name": "cleanLong",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "leverageToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "targetToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountTargetToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountFlashLoan",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "unitAmt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rateMode",
        "type": "uint256"
      }
    ],
    "name": "closeLong",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "flashAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "flashBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "flashFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "flashInitiator",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "flashToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lender",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initiator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "onFlashLoan",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "opCenterAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "leverageToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "targetToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountLeverageToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountFlashLoan",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "unitAmt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rateMode",
        "type": "uint256"
      }
    ],
    "name": "openLong",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "paybackToken",
        "type": "address"
      }
    ],
    "name": "repay",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "collateralToken",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]
