import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { RuleId } from './RuleId'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'

export class RefillRecruitmentLineRule extends PlayerTurnRule {

  onRuleStart() {
    const moves: MaterialMove[] = []
    const playerDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.id === this.player).deck()
    const totalCardsInRecruitmentLine = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getQuantity()
    moves.push(...playerDeck.deal({ type: LocationType.RecruitmentLine }, 7 - totalCardsInRecruitmentLine))
    moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))

    return moves
  }
}