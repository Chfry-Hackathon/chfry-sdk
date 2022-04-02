import Web3 from 'web3'

export type DSAConfig =
| {
    web3: Web3
    mode: 'node'
    privateKey: string
  }
| {
    web3: Web3
    mode: 'simulation'
    publicKey: string
  }
| {
    web3: Web3
    mode?: 'browser'
  }

  export function getDSAConfig(config: Web3 | DSAConfig): DSAConfig {

    // config不能为空
    if (!config) throw new Error('Invalid config. Pass web3 instance or DSAConfig.')
  
    //如果传入了web3 实例，则直接确定为浏览器模式
    if (isWeb3(config)) return { web3: config, mode: 'browser' }
  
    //如果config未配置web3 实例，则报错
    if (!config.web3) throw new Error('Invalid config. Pass web3 instance or DSAConfig.')
  
    if (config.mode === 'node') {
      if (!config.privateKey) throw new Error(`Property 'privateKey' is not defined in config.`)
  
      const privateKey = config.privateKey.slice(0, 2) != '0x' ? '0x' + config.privateKey : config.privateKey
  
      return {
        web3: config.web3,
        mode: config.mode,
        privateKey,
      }
  
    }

    else if (config.mode === 'simulation') {
      if (!config.publicKey) throw new Error(`Property 'publicKey' is not defined in config.`)
      if (!config.web3.utils.isAddress(config.publicKey.toLowerCase()))
        throw new Error(`Property 'publicKey' is not a address.`)
  
      const publicKey = config.web3.utils.toChecksumAddress(config.publicKey.toLowerCase())
      return {
        web3: config.web3,
        mode: 'simulation',
        publicKey: publicKey,
      }
  
    } 
    
    else if (!config.mode || config.mode === 'browser') {
  
      return {
        web3: config.web3,
        mode: 'browser',
      }
    } else {
      throw new Error(`Mode '${config.mode}' not recognized. Use 'node' or 'browser' as mode.`)
    }
  
  }
  
  function isWeb3(config: Web3 | DSAConfig): config is Web3 {
    return !!(config as Web3).version
  }
  