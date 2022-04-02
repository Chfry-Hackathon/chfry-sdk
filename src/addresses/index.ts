
import { account as mainnetAccount, connectors as mainnetConnectors, resolvers as mainnetResolvers,token as mainnetToken, aave as mainnetAave } from './mainnet'
import { account as kovanAccount, connectors as kovanConnectors, resolvers as kovanResolvers,token as kovanToken,aave as kovanAave} from './kovan'
import { account as fujiAccount, connectors as fujiConnectors, resolvers as fujiResolvers,token as fujiToken } from './fuji'


export const Addresses = {
  1: {
    account: mainnetAccount,
    conncetors: mainnetConnectors,
    resolvers: mainnetResolvers,
    token: mainnetToken,
    aave: mainnetAave
  },
  42: {
    account: kovanAccount,
    conncetors: kovanConnectors,
    resolvers: kovanResolvers,
    token: kovanToken,
    aave: mainnetAave
  },
  43113: {
    account: fujiAccount,
    conncetors: fujiConnectors,
    resolvers: fujiResolvers,
    token: fujiToken,
    aave: mainnetAave
  }
}
