import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { RuleId } from './RuleId'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { ElementsHelper } from './helpers/ElementsHelper'

export class RefillRecruitmentLineRule extends PlayerTurnRule {

  onRuleStart() {
    const moves: MaterialMove[] = []
    const playerDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.player === this.player).deck()
    const totalCardsInRecruitmentLine = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getQuantity()
    moves.push(...playerDeck.deal({ type: LocationType.RecruitmentLine }, 7 - totalCardsInRecruitmentLine))
    if (!new ElementsHelper(this.game, this.player).isBonusAction()) {
      moves.push(this.startRule(RuleId.EndTurn))
    } else {
      new ElementsHelper(this.game, this.player).removeLastBonusElement()
      moves.push(this.startRule(RuleId.BonusAction))
    }

    return moves
  }
}