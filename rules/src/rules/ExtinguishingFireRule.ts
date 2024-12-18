import { CustomMove, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Element } from '../Season'
import { CustomMoveType } from './CustomMoveType'
import { ElementsHelper } from './helpers/ElementsHelper'
import { FireHelper } from './helpers/FireHelper'
import { PlayerTurnHelper } from './PlayerTurnHelper'
// import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class ExtinguishingFireRule extends PlayerTurnRule {
  elementsHelper = new ElementsHelper(this.game, this.player)
  elementValue = this.elementsHelper.getRemainingElementValue()

  onRuleStart() {
    if (!new FireHelper(this.game,this.player).canFireBeExtinguished(this.elementValue)) {
      if (!this.elementsHelper.isBonusAction()) {        
        return [new PlayerTurnHelper(this.game).endCurrentPlayerTurn()]
      } else {
        this.elementsHelper.removeLastBonusElement()
        return[this.startRule(RuleId.BonusAction)]       
      }
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const availableFireTokens = new FireHelper(this.game,this.player).getAvailableFireTokens(this.elementValue)
    moves.push(...availableFireTokens.moveItems({type: LocationType.PlayerFireStock, player: this.player}))

    // Only can pass if at least one fire was taken
    const lastTokenX = !this.elementsHelper.isBonusAction() ? this.material(MaterialType.ActionToken).location(LocationType.ActionToken).locationId(Element.Water).getItem()?.location.x : undefined
    if (this.elementValue < this.elementsHelper.getElementValue(Element.Water, this.player, lastTokenX)) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }

    return moves
  }

  getClearingCardValue(x: number) {
    return new FireHelper(this.game,this.player).getClearingCardValue(x)
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
      if (!this.elementsHelper.isBonusAction()) {
        return [new PlayerTurnHelper(this.game).endCurrentPlayerTurn()]
      } else {
        return[this.startRule(RuleId.BonusAction)]
      }
    }
    return []
  }

  beforeItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.FireToken)(move)) {
      const x = Number(this.material(move.itemType).getItem(move.itemIndex).location.x)
      this.elementsHelper.updateRemainingElementValue(this.elementValue - this.getClearingCardValue(x))
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.FireToken)(move)) {
      if (this.material(MaterialType.FireToken).location(l => l.type === LocationType.PlayerFireStock && l.player === this.player).getQuantity() === 8) {
        moves.push(this.endGame())
      } else {
        moves.push(this.startRule(RuleId.ExtinguishingFire))
      }
    }
    
    return moves
  }
}