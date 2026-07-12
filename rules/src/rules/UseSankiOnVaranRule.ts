import { MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { UseSankiRule } from './UseSankiRule'

export class UseSankiOnVaranRule extends UseSankiRule {
  onPass() {
    const moves: MaterialMove[] = []
    moves.push(this.varan.moveItem({ type: LocationType.PlayerHelpLine, player: this.player }))
    // Keeping the varan keeps its solitary symbol for this player: apply the solitary penalty.
    // Only this player is affected (the varan goes to their personal help line, not the shared one).
    moves.push(...new AnimalsHelper(this.game).getSolitaryPenaltyMoves(this.player))
    if (this.player === this.remind(Memory.CurrentPlayer) || !this.hasAvailableActionToken()) {
      moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    } else {
      moves.push(this.startRule(RuleId.PlayerAction))
    }
    return moves
  }

  hasAvailableActionToken() {
    return this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.player).length > 0
  }

  onUseSanki(): MaterialMove[] {
    return [
      this.varan.moveItem({ type: LocationType.VaranDeck, player: this.player }),
      this.startRule(RuleId.EndPlayerTurn)
    ]
  }

  get varan() {
    return this.material(MaterialType.AnimalCard).location(LocationType.SharedHelpLine).maxBy(item => item.location.x!)
  }
}