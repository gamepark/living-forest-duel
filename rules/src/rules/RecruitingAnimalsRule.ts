import { CustomMove, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Animal, animalProperties, getAnimalSeason } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { ActionRule } from './ActionRule'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class RecruitingAnimalsRule extends ActionRule {

  get availableAnimals() {
    return this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .id<Animal>(animal => this.action.value >= animalProperties[animal].cost!)
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    const availableAnimals = this.availableAnimals
    const playerCards = availableAnimals.id<Animal>(animal => getAnimalSeason(animal) === this.player)
    moves.push(...playerCards.moveItems({ type: LocationType.PlayerHelpLine, player: this.player }))
    const restOfCards = availableAnimals.id<Animal>(animal => getAnimalSeason(animal) !== this.player)
    moves.push(...restOfCards.moveItems({ type: LocationType.SharedDiscardPile }))

    if (this.canPass()) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }

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
