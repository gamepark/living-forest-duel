import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

import { AnimalsHelper } from './helpers/AnimalsHelper'
import { Animal, animalProperties, getAnimalSeason } from '../material/Animal'

export class RecruitingAnimalsRule extends PlayerTurnRule {
  onRuleStart() {
    const animalsIds = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getItems().map(animal => animal.id)
    const minCost = new AnimalsHelper(this.game, this.player).getAnimalsMinCost(animalsIds) || 0

    if (minCost > this.remind(Memory.RemainingElementValue)) {
      return [this.startRule(RuleId.RefillRecruitmentLine)]
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    const playerCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .filter((animal) => getAnimalSeason(animal.id) === this.player && this.remind(Memory.RemainingElementValue) >= animalProperties[animal.id as Animal]?.cost!)
    moves.push(...playerCards.moveItems({ type: LocationType.PersonalHelpLine, id: this.player }))

    const restOfCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .filter((animal) => getAnimalSeason(animal.id) !== this.player && this.remind(Memory.RemainingElementValue) >= animalProperties[animal.id as Animal]?.cost!)
    moves.push(...restOfCards.moveItems({ type: LocationType.SharedDiscardPile }))

    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.AnimalCard)(move) && (move.location.type === LocationType.PersonalHelpLine || move.location.type === LocationType.SharedDiscardPile)) {
      // Check winning condition
      if (this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine)
        .filter((animal) => getAnimalSeason(animal.id) !== this.player).getQuantity() === 0) {
        moves.push(this.startRule(RuleId.EndGame))
      } else {
        const movedCard = this.material(MaterialType.AnimalCard).index(move.itemIndex).getItem()
        this.memorize(Memory.RemainingElementValue, this.remind(Memory.RemainingElementValue) - animalProperties[movedCard!.id as Animal]!.cost)

        moves.push(this.startRule(RuleId.RecruitingAnimals))
      }
    }

    return moves
  }

}