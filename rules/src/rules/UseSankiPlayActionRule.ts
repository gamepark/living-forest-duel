import { MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerTurnHelper } from './PlayerTurnHelper'
import { PlayerUseActionTokenRule } from './PlayerUseActionTokenRule'
import { RuleId } from './RuleId'
import { UseSankiRule } from './UseSankiRule'

export class UseSankiPlayActionRule extends UseSankiRule {
  onRuleStart() {
    if (!this.opponentHasActionToken || !new PlayerUseActionTokenRule(this.game).getPlayerMoves().length) {
      return [new PlayerTurnHelper(this.game).endCurrentPlayerTurn()]
    }
    return []
  }

  get opponentHasActionToken() {
    return this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.nextPlayer).length > 0
  }

  onPass(): MaterialMove[] {
    return [new PlayerTurnHelper(this.game).endCurrentPlayerTurn()]
  }

  onUseSanki(): MaterialMove[] {
    return [this.startRule(RuleId.PlayerUseActionToken)]
  }
}