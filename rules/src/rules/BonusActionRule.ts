import { PlayerTurnRule } from '@gamepark/rules-api'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { Element } from '../Season'
import { ElementsHelper } from './helpers/ElementsHelper'

export abstract class BonusActionRule extends PlayerTurnRule {
  abstract bonusRule: number

  onRuleStart() {
    const bonus = this.remind(Memory.RemainingBonuses).pop()
    if (bonus !== undefined) {
      this.memorize(Memory.BonusAction, this.bonusRule)
      switch (bonus) {
        case Element.Sun:
          new ElementsHelper(this.game, this.player).setRemainingBonusElementValue(Element.Sun)
          return [this.startRule(RuleId.RecruitingAnimals)]
        case Element.Plant:
          new ElementsHelper(this.game, this.player).setRemainingBonusElementValue(Element.Plant)
          return [this.startRule(RuleId.PlantingProtectiveTree)]
        case Element.Water:
          new ElementsHelper(this.game, this.player).setRemainingBonusElementValue(Element.Water)
          return [this.startRule(RuleId.ExtinguishingFire)]
        case Element.Wind:
          return [this.startRule(RuleId.PlantingProtectiveTree)]
        default:
          return []
      }      
    } else {
      this.memorize(Memory.BonusAction, 0)
      // If it's an Onibi bonus action, go to next player, in other case continue the Plant trees in case there are other trees to take
      return [this.bonusRule === Element.Wind ? this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer) : this.startRule(RuleId.PlantingProtectiveTree)]
    }
  }
}