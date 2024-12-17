import { CustomMove, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { CustomMoveType } from './CustomMoveType'

export abstract class UseSankiRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const playerSankiCards = this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.player === this.player)
    moves.push(...playerSankiCards.moveItems({ type: LocationType.SankiDeck }))
    moves.push(this.customMove(CustomMoveType.Pass))

    return moves
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
      return this.onPass()
    }
    return []
  }

  abstract onPass(): MaterialMove[]

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.SpiritCard)(move)) {
      return this.onUseSanki()
    }
    return []
  }

  abstract onUseSanki(): MaterialMove[]
}