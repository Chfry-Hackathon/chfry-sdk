import { AbiItem } from 'web3-utils'

export const AaveV2: AbiItem[] = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_wethAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_aaveAddressProvider",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_aaveProtocolDataProvider",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_chainlinkEthFeed",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_aaveIncentivesAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_rewardToken",
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
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "contract AaveLendingPool",
        "name": "aave",
        "type": "address"
      }
    ],
    "name": "getConfig",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "data",
            "type": "uint256"
          }
        ],
        "internalType": "struct AaveLendingPool.UserConfigurationMap",
        "name": "data",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getConfiguration",
    "outputs": [
      {
        "internalType": "bool[]",
        "name": "collateral",
        "type": "bool[]"
      },
      {
        "internalType": "bool[]",
        "name": "borrowed",
        "type": "bool[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract AaveLendingPool",
        "name": "aave",
        "type": "address"
      }
    ],
    "name": "getList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "data",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      }
    ],
    "name": "getPosition",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenPriceInEth",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenPriceInUsd",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "supplyBalance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stableBorrowBalance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "variableBorrowBalance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "supplyRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stableBorrowRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "userStableBorrowRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "variableBorrowRate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isCollateral",
            "type": "bool"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "ltv",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "threshold",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "reserveFactor",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "usageAsCollEnabled",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "borrowEnabled",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "stableBorrowEnabled",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "isFrozen",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "totalSupply",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "availableLiquidity",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalStableDebt",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalVariableDebt",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalATokenSupply",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalCurrentVariableDebt",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "aTokenAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "stableDebtTokenAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "variableDebtTokenAddress",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "aEmissionPerSecond",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "vEmissionPerSecond",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "sEmissionPerSecond",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "rewardPriceInEth",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "decimal",
                "type": "uint256"
              }
            ],
            "internalType": "struct AaveHelpers.AaveTokenData",
            "name": "aaveTokenData",
            "type": "tuple"
          }
        ],
        "internalType": "struct AaveHelpers.AaveUserTokenData[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "totalCollateralETH",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalBorrowsETH",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "availableBorrowsETH",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currentLiquidationThreshold",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "ltv",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "healthFactor",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "ethPriceInUsd",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pendingRewards",
            "type": "uint256"
          }
        ],
        "internalType": "struct AaveHelpers.AaveUserData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReservesList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "data",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "self",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveIndex",
        "type": "uint256"
      }
    ],
    "name": "isBorrowing",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "self",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveIndex",
        "type": "uint256"
      }
    ],
    "name": "isUsingAsCollateral",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "self",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveIndex",
        "type": "uint256"
      }
    ],
    "name": "isUsingAsCollateralOrBorrowing",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]