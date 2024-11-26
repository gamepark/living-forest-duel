import { CustomMove, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { SpiritType } from '../material/SpiritType'
import { CustomMoveType } from './CustomMoveType'
import { AnimalsHelper } from './helpers/AnimalsHelper'

export class UseSankiCardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const playerSankiCards = this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.id === this.player)
    moves.push(...playerSankiCards.moveItems({ type: LocationType.SankiDeck }))
    moves.push(this.customMove(CustomMoveType.SankiPass))

    return moves
  }


  onCustomMove(move: CustomMove) {
    const moves: MaterialMove[] = []
    // If the player could use here the Sanki card and passed it's because it was a Varan, so we need to check the amount of solitary animals for the player
    if (move.type === CustomMoveType.SankiPass
      // && this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player).getQuantity() > 0 // This can't happen
      && new AnimalsHelper(this.game, this.player).checkTooManySolitaryAnimals(this.player)) {
      moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player).deleteItem())
    }

    return []
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.SpiritCard)(move)) {
      const fireVarans = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.PlayerHelpLine && l.id === this.player)
      const items = fireVarans.getItems()
      const lastFireVaran = fireVarans.location(l => !items.some(item => item.location.id === l.id && item.location.x! > l.x!))
      moves.push(lastFireVaran.moveItem({ type: LocationType.VaranDeck, id: this.player }))
    }

    return moves
  }
}