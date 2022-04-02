import { AbiItem } from 'web3-utils'

export const OpCast: AbiItem[] = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_connectorCenter",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "targetsName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "eventName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "eventParam",
        "type": "bytes"
      }
    ],
    "name": "LogCast",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "connectorCenter",
        "type": "address"
      }
    ],
    "name": "SetConnectorCenter",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct Spell[]",
        "name": "spells",
        "type": "tuple[]"
      }
    ],
    "name": "cast",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "connectorCenter",
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