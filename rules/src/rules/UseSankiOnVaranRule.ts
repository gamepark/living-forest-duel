import { MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { UseSankiRule } from './UseSankiRule'

export class UseSankiOnVaranRule extends UseSankiRule {
  onPass() {
    const moves: MaterialMove[] = []
    if (this.player === this.remind(Memory.CurrentPlayer)) {
      moves.push(this.startRule(RuleId.PlayerAction))
    } else {
      moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    }
    moves.push(this.varan.moveItem({ type: LocationType.PlayerHelpLine, player: this.player }))
    return moves
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