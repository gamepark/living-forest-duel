import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { RuleId } from './RuleId'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Memory } from './Memory'

export class RefillRecruitmentLineRule extends PlayerTurnRule {

  onRuleStart() {
    const moves: MaterialMove[] = []
    const playerDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.id === this.player).deck()
    const totalCardsInRecruitmentLine = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getQuantity()
    moves.push(...playerDeck.deal({ type: LocationType.RecruitmentLine }, 7 - totalCardsInRecruitmentLine))
    if (!this.remind(Memory.BonusAction)) {
      moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    } else {
      moves.push(this.startRule(RuleId.TreeBonusAction))
    }

    return moves
  }
}