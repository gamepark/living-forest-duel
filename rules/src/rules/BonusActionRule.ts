import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { Element, getOpponentSeason } from '../Season'
import { ElementsHelper } from './helpers/ElementsHelper'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { LocationType } from '../material/LocationType'

export abstract class BonusActionRule extends PlayerTurnRule {
  abstract bonusRule: number

  onRuleStart() {
    const bonus = this.remind(Memory.RemainingBonuses).pop()
    if (bonus !== undefined) {
      const moves: MaterialMove[] = []
      this.memorize(Memory.BonusAction, this.bonusRule)
      switch (bonus) {
        case Element.Sun:
          new ElementsHelper(this.game, this.player).setRemainingBonusElementValue(Element.Sun)
          moves.push(this.startRule(RuleId.RecruitingAnimals))
          break
        case Element.Water:
          new ElementsHelper(this.game, this.player).setRemainingBonusElementValue(Element.Water)
          moves.push(this.startRule(RuleId.ExtinguishingFire))
          break
        case Element.Plant:
          new ElementsHelper(this.game, this.player).setRemainingBonusElementValue(Element.Plant)
          moves.push(this.startRule(RuleId.PlantingProtectiveTree))
          break
        case Element.Wind:
          const sankiCards = this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(LocationType.SankiDeck).getQuantity() > 0
            ? this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(LocationType.SankiDeck).deck()
            : this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.player === getOpponentSeason(this.player)).deck()
          if (sankiCards.getQuantity() > 0) {
            moves.push(sankiCards.dealOne({ type: LocationType.PlayerSpiritLine, player: this.player }))
          }
          // If it's an Onibi bonus action, check end turn, in other case continue the Plant trees in case there are other trees to take
          moves.push(this.bonusRule === Element.Wind ? this.startRule(RuleId.EndTurn) : this.startRule(RuleId.PlantingProtectiveTree))
          this.memorize(Memory.BonusAction, 0)
          break
      }
      return moves
    } else {
      this.memorize(Memory.BonusAction, 0)
      // If it's an Onibi bonus action, check end turn, in other case continue the Plant trees in case there are other trees to take
      return [this.bonusRule === Element.Wind ? this.startRule(RuleId.EndTurn) : this.startRule(RuleId.PlantingProtectiveTree)]
    }
  }
}