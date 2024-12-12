import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { RuleId } from './RuleId'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Memory } from './Memory'
import { Element } from '../Season'

export class RefillRecruitmentLineRule extends PlayerTurnRule {

  onRuleStart() {
    const moves: MaterialMove[] = []
    const playerDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.player === this.player).deck()
    const totalCardsInRecruitmentLine = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getQuantity()
    moves.push(...playerDeck.deal({ type: LocationType.RecruitmentLine }, 7 - totalCardsInRecruitmentLine))
    if (!this.remind(Memory.BonusAction)) {
      // moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
      moves.push(this.startRule(RuleId.EndTurn))
    } else {
      moves.push(this.startRule(this.remind(Memory.BonusAction) === Element.Plant ? RuleId.TreeBonusAction : RuleId.OnibiBonusAction))
    }

    return moves
  }
}