import { PlayerTurnRule } from '@gamepark/rules-api'
import { Memory } from './Memory'

export class TreeBonusActionRule extends PlayerTurnRule {
  onRuleStart() {
    console.log( this.remind(Memory.RemainingBonuses))
    return []
  }
}