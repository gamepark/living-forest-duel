import { PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getOpponentSeason, Season } from '../Season'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class EndPlayerTurnRule extends PlayerTurnRule {
  onRuleStart() {
    const currentPlayer = this.remind<Season>(Memory.CurrentPlayer)
    const opponent = getOpponentSeason(currentPlayer)
    const availableActionToken = this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply)
    if (availableActionToken.length === 0) {
      return [this.player === currentPlayer ? this.startRule(RuleId.EndTurn) : this.startPlayerTurn(RuleId.EndTurn, currentPlayer)]
    } else if (availableActionToken.player(opponent).length === 0) {
      return [this.player === currentPlayer ? this.startRule(RuleId.PlayerAction) : this.startPlayerTurn(RuleId.PlayerAction, currentPlayer)]
    } else {
      return [this.player === currentPlayer ? this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer) : this.startRule(RuleId.PlayerAction)]
    }
  }
}