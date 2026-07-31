import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { SpiritType } from '../../material/SpiritType'
import { getOpponentSeason } from '../../Season'

export class SankiHelper extends PlayerTurnRule {
  takeSankiCards(quantity = 1) {
    const moves: MaterialMove[] = []
    // The Sanki deck is a single item with a quantity, so the cards must be taken one unit at a time
    const sankiDeck = this.material(MaterialType.SpiritCard).location(LocationType.SankiDeck)
    const sankiDeckQuantity = sankiDeck.getQuantity()
    if (sankiDeckQuantity > 0) {
      const deal = Math.min(quantity, sankiDeckQuantity)
      quantity -= deal
      for (let i = 0; i < deal; i++) {
        moves.push(sankiDeck.moveItem({ type: LocationType.PlayerSpiritLine, player: this.player }, 1))
      }
    }
    if (quantity > 0) {
      const opponentSanki = this.material(MaterialType.SpiritCard).location(LocationType.PlayerSpiritLine)
        .id(SpiritType.Sanki).player(getOpponentSeason(this.player)).deck()
      moves.push(...opponentSanki.deal({ type: LocationType.PlayerSpiritLine, player: this.player }, quantity))
    }
    return moves
  }
}