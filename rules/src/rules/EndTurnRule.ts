import { PlayerTurnRule } from '@gamepark/rules-api'
import { RuleId } from './RuleId'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'

export class EndTurnRule extends PlayerTurnRule {

  onRuleStart() {
    if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).getQuantity() > 0) {
      return[this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer)]
    } else {
      // TODO: End turn actions
      return []
    }
    
  }
}