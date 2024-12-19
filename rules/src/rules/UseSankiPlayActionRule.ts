import { MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerUseActionTokenRule } from './PlayerUseActionTokenRule'
import { RuleId } from './RuleId'
import { UseSankiRule } from './UseSankiRule'

export class UseSankiPlayActionRule extends UseSankiRule {
  onRuleStart() {
    if (!this.opponentHasActionToken || !new PlayerUseActionTokenRule(this.game).getPlayerMoves().length) {
      return [this.startRule(RuleId.EndPlayerTurn)]
    }
    return []
  }

  get opponentHasActionToken() {
    return this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.nextPlayer).length > 0
  }

  onPass(): MaterialMove[] {
    return [this.startRule(RuleId.EndPlayerTurn)]
  }

  onUseSanki(): MaterialMove[] {
    return [this.startRule(RuleId.PlayerUseActionToken)]
  }
}