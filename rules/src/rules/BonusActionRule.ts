import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Memory } from './Memory'
import { PlayerTurnHelper } from './PlayerTurnHelper'
import { RuleId } from './RuleId'
import { Element, getOpponentSeason } from '../Season'
import { ElementsHelper } from './helpers/ElementsHelper'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { LocationType } from '../material/LocationType'

export class BonusActionRule extends PlayerTurnRule {
  elementsHelper = new ElementsHelper(this.game, this.player)

  onRuleStart() {
    const bonus = this.remind(Memory.RemainingBonuses).slice(-1)[0]
    if (bonus !== undefined) {
      const moves: MaterialMove[] = []
      switch (bonus.element) {
        case Element.Sun:
          if (bonus.remainingElementValue === -1) {
            this.elementsHelper.setRemainingBonusElementValue(Element.Sun)
          }
          moves.push(this.startRule(RuleId.RecruitingAnimals))
          break
        case Element.Water:
          if (bonus.remainingElementValue === -1) {
            this.elementsHelper.setRemainingBonusElementValue(Element.Water)
          }
          moves.push(this.startRule(RuleId.ExtinguishingFire))
          break
        case Element.Plant:
          if (bonus.remainingElementValue === -1) {
            this.elementsHelper.setRemainingBonusElementValue(Element.Plant)
          }
          moves.push(this.startRule(RuleId.PlantingProtectiveTree))
          break
        case Element.Wind:
          const sankiCards = this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(LocationType.SankiDeck).getQuantity() > 0
            ? this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(LocationType.SankiDeck).deck()
            : this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.player === getOpponentSeason(this.player)).deck()
          if (sankiCards.getQuantity() > 0) {
            moves.push(sankiCards.dealOne({ type: LocationType.PlayerSpiritLine, player: this.player }))
          }

          const remainingBonuses = this.elementsHelper.removeLastBonusElement()
          if (remainingBonuses.length > 0) {
            moves.push(this.startRule(RuleId.BonusAction))
          } else {
            const remainingElementValue = this.elementsHelper.getRemainingElementValue()
            if (remainingElementValue > 0) {
              moves.push(this.startRule(RuleId.PlantingProtectiveTree))
            } else {
              moves.push(new PlayerTurnHelper(this.game).endCurrentPlayerTurn())
            }
          }
          break
      }
      return moves
    } else {
      const remainingBonuses = this.elementsHelper.removeLastBonusElement()
      if (remainingBonuses.length === 0) {
        const currentAction = this.remind(Memory.CurrentAction)
        // We can only be in bonus from trees or Onibi. Only the tress can still have points to expend
        if (currentAction.element === Element.Plant && currentAction.remainingElementValue > 0) {
          return [this.startRule(RuleId.PlantingProtectiveTree)]
        } else {
          return [new PlayerTurnHelper(this.game).endCurrentPlayerTurn()]
        }
      } else {
        return [this.startRule(RuleId.BonusAction)]
      }
    }
  }
}