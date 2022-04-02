import { AbiItem } from 'web3-utils'

export const accountProxy: AbiItem[] = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_opCenterInterface",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [],
        "name": "opCenter",
        "outputs": [
            {
                "internalType": "contract OpCenterInterface",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]