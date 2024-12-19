import { MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ActionRule } from './ActionRule'
import { RecruitingAnimals } from './actions/Action'

export class RefillRecruitmentLineRule extends ActionRule<RecruitingAnimals> {

  onRuleStart() {
    const moves: MaterialMove[] = []
    const playerDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.player === this.player).deck()
    const totalCardsInRecruitmentLine = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getQuantity()
    moves.push(...playerDeck.deal({ type: LocationType.RecruitmentLine }, 7 - totalCardsInRecruitmentLine))
    moves.push(this.endAction())
    return moves
  }
}