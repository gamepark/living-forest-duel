import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { SpiritType } from '../../material/SpiritType'
import { getOpponentSeason } from '../../Season'

export class SankiHelper extends PlayerTurnRule {
  takeSankiCards(quantity = 1) {
    const moves: MaterialMove[] = []
    const sankiDeck = this.material(MaterialType.SpiritCard).location(LocationType.SankiDeck).deck()
    if (sankiDeck.length > 0) {
      const deal = Math.min(quantity, sankiDeck.length)
      quantity -= deal
      moves.push(...sankiDeck.deal({ type: LocationType.PlayerSpiritLine, player: this.player }, deal))
    }
    if (quantity > 0) {
      const opponentSanki = this.material(MaterialType.SpiritCard).location(LocationType.PlayerSpiritLine)
        .id(SpiritType.Sanki).player(getOpponentSeason(this.player)).deck()
      moves.push(...opponentSanki.deal({ type: LocationType.PlayerSpiritLine, player: this.player }, quantity))
    }
    return moves
  }
}