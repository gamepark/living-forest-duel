import { CustomMove, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ActionRule } from './ActionRule'
import { CustomMoveType } from './CustomMoveType'
import { FireHelper } from './helpers/FireHelper'
import { Memory } from './Memory'

export class ExtinguishingFireRule extends ActionRule {

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const availableFireTokens = new FireHelper(this.game).getAvailableFireTokens(this.action.value)
    moves.push(...availableFireTokens.moveItems({ type: LocationType.PlayerFireStock, player: this.player }))

    if (this.canPass()) {
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