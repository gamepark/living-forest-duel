import { PlayerTurnRule } from '@gamepark/rules-api'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { Element } from '../Season'
import { ElementsHelper } from './helpers/ElementsHelper'

export class TreeBonusActionRule extends PlayerTurnRule {
  onRuleStart() {
    const bonus = this.remind(Memory.RemainingBonuses).pop()
    if (bonus !== undefined) {
      this.memorize(Memory.BonusAction, true)
      switch (bonus) {
        case Element.Sun:
          new ElementsHelper(this.game, this.player).setRemainingBonusElementValue(Element.Sun)
          return [this.startRule(RuleId.RecruitingAnimals)]
        case Element.Plant:
          return [this.startRule(RuleId.PlantingProtectiveTree)]
        case Element.Water:
          return [this.startRule(RuleId.PlantingProtectiveTree)]
        case Element.Wind:
          return [this.startRule(RuleId.PlantingProtectiveTree)]
        default:
          return []
      }
      
    } else {
      this.memorize(Memory.BonusAction, false)
      return [this.startRule(RuleId.PlantingProtectiveTree)]
    }
  }
}