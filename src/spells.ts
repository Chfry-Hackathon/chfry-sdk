import { Connector } from "./abi/connectors";

export type Spell = {
  connector: Connector
  method: string
  args: any[]
}

export class Spells {

  data: Spell[] = []
  add(spell: Spell) {
    if (!spell.connector) {
      throw new Error(`connector not defined.`)
    }
    if (!spell.method) {
      throw new Error(`method not defined.`)
    }
    if (!spell.args) {
      throw new Error(`args not defined.`)
    }
    this.data.push(spell)
    return this
  }
}
