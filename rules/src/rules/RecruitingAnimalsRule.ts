import { CustomMove, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Animal, animalProperties, getAnimalSeason } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Element } from '../Season'
import { ActionRule } from './ActionRule'
import { RecruitingAnimals } from './actions/Action'
import { CustomMoveType } from './CustomMoveType'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { ElementsHelper } from './helpers/ElementsHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class RecruitingAnimalsRule extends ActionRule<RecruitingAnimals> {
  elementsHelper = new ElementsHelper(this.game)

  onRuleStart() {
    if (!new AnimalsHelper(this.game).canAnimalsBeRecruited(this.action.value)) {
      return [this.startRule(RuleId.RefillRecruitmentLine)]
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    const playerCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .id<Animal>(animal => getAnimalSeason(animal) === this.player && this.action.value >= animalProperties[animal].cost!)
    moves.push(
      ...playerCards.getItems().flatMap((card) => {
        return [
          ...playerCards.id(card.id).moveItems({ type: LocationType.PlayerHelpLine, player: getAnimalSeason(card.id) })
        ]
      })
    )

    // Only can pass if at least one animal was taken
    if (this.action.value < this.elementsHelper.getElementValue(Element.Sun, !this.isBonusAction)) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }

    const restOfCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .id<Animal>(animal => getAnimalSeason(animal) !== this.player && this.action.value >= animalProperties[animal].cost!)
    moves.push(...restOfCards.moveItems({ type: LocationType.SharedDiscardPile }))

    return moves
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
      return [this.startRule(RuleId.RefillRecruitmentLine)]
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.AnimalCard)(move) && (move.location.type === LocationType.PlayerHelpLine || move.location.type === LocationType.SharedDiscardPile)) {
      // Check winning condition
      if (this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
        .id<Animal>(animal => getAnimalSeason(animal) !== this.player).getQuantity() === 0) {
        this.memorize(Memory.Winner, this.player)
        return [this.endGame()]
      } else {
        const movedCard = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex)
        this.action.value -= animalProperties[movedCard.id].cost
      }
    }
    return []
  }
}
