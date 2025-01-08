import { CustomMove, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Element } from '../Season'
import { ActionRule } from './ActionRule'
import { ExtinguishingFire } from './actions/Action'
import { CustomMoveType } from './CustomMoveType'
import { ElementsHelper } from './helpers/ElementsHelper'
import { FireHelper } from './helpers/FireHelper'
import { Memory } from './Memory'

export class ExtinguishingFireRule extends ActionRule<ExtinguishingFire> {
  onRuleStart() {
      if (!new FireHelper(this.game).canFireBeExtinguished(this.action.value)) {
      return [this.endAction()]
    }
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const availableFireTokens = new FireHelper(this.game).getAvailableFireTokens(this.action.value)
    moves.push(...availableFireTokens.moveItems({ type: LocationType.PlayerFireStock, player: this.player }))

    // Only can pass if at least one fire was taken
    const elementsHelper = new ElementsHelper(this.game)
    if (this.action.value < elementsHelper.getElementValue(Element.Water, !this.isBonusAction)) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }

    return moves
  }

  getClearingCardValue(x: number) {
    return new FireHelper(this.game).getClearingCardValue(x)
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
      return [this.endAction()]
    }
    return []
  }

  beforeItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.FireToken)(move)) {
      const x = this.material(move.itemType).getItem(move.itemIndex).location.x!
      this.action.value -= this.getClearingCardValue(x)
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.FireToken)(move)
      && this.material(MaterialType.FireToken).location(LocationType.PlayerFireStock).player(this.player).getQuantity() === 8) {
      this.memorize(Memory.Winner, this.player)
      return [this.endGame()]
    }
    return []
  }
}