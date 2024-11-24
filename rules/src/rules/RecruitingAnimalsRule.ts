import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

import { AnimalsHelper } from './helpers/AnimalsHelper'
import { Animal, animalProperties, getAnimalSeason } from '../material/Animal'

export class RecruitingAnimalsRule extends PlayerTurnRule {
  elementValue = !this.remind(Memory.BonusAction) ? this.remind(Memory.RemainingElementValue) : this.remind(Memory.RemainingBonusElementValue)

  onRuleStart() {
    const animalsIds = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getItems().map(animal => animal.id)
    const minCost = new AnimalsHelper(this.game, this.player).getAnimalsMinCost(animalsIds) || 0
    // if (minCost > this.remind(Memory.RemainingElementValue)) {
    if (minCost > this.elementValue) {
      return [this.startRule(RuleId.RefillRecruitmentLine)]
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    const playerCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .filter((animal) => getAnimalSeason(animal.id) !== 0 && this.elementValue >= animalProperties[animal.id as Animal]?.cost!)
    moves.push(
      ...playerCards.getItems().flatMap((card) => {
        return [
          ...playerCards.id(card.id).moveItems({ type: LocationType.PlayerHelpLine, id: getAnimalSeason(card.id) })
        ]
      })
    )

    const restOfCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .filter((animal) => getAnimalSeason(animal.id) === 0 && this.elementValue >= animalProperties[animal.id as Animal]?.cost!)
    moves.push(...restOfCards.moveItems({ type: LocationType.SharedDiscardPile }))

    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.AnimalCard)(move) && (move.location.type === LocationType.PlayerHelpLine || move.location.type === LocationType.SharedDiscardPile)) {
      // Check winning condition
      if (this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine)
        .filter((animal) => getAnimalSeason(animal.id) !== this.player).getQuantity() === 0) {
        moves.push(this.startRule(RuleId.EndGame))
      } else {
        const movedCard = this.material(MaterialType.AnimalCard).index(move.itemIndex).getItem()
        this.memorize(!this.remind(Memory.BonusAction) ? Memory.RemainingElementValue : Memory.RemainingBonusElementValue, this.elementValue - animalProperties[movedCard!.id as Animal]!.cost)

        moves.push(this.startRule(RuleId.RecruitingAnimals))
      }
    }

    return moves
  }

}