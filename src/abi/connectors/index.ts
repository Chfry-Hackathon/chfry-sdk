import {AAVE_V2} from './AAVE-V2-A'
import {BASIC} from './BASIC-A'
import {FLASH_FRYER} from './FLASH-FRYER'
import {UNISWAP_V2_A} from './UNISWAP-V2-A'

export const connectors =  {
    "BASIC-A":BASIC,
    "AAVE-V2-A": AAVE_V2,
    "FLASH-FRYER": FLASH_FRYER,
    "UNISWAP-V2-A": UNISWAP_V2_A
}

export type Connector =  keyof typeof connectors 
