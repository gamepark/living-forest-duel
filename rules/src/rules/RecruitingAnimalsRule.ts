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
    if (!new AnimalsHelper(this.game,this.player).canAnimalsBeRecruited(this.elementValue)) {
      return [this.startRule(RuleId.RefillRecruitmentLine)]
    }
  
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    const playerCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .id<Animal>(animal => getAnimalSeason(animal) === this.player && this.elementValue >= animalProperties[animal].cost!)
    moves.push(
      ...playerCards.getItems().flatMap((card) => {
        return [
          ...playerCards.id(card.id).moveItems({ type: LocationType.PlayerHelpLine, id: getAnimalSeason(card.id) })
        ]
      })
    )

    const restOfCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .id<Animal>(animal => getAnimalSeason(animal) !== this.player && this.elementValue >= animalProperties[animal].cost!)
    moves.push(...restOfCards.moveItems({ type: LocationType.SharedDiscardPile }))

    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.AnimalCard)(move) && (move.location.type === LocationType.PlayerHelpLine || move.location.type === LocationType.SharedDiscardPile)) {
      // Check winning condition
      if (this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine)
        .id<Animal>(animal => getAnimalSeason(animal) !== this.player).getQuantity() === 0) {
        moves.push(this.startRule(RuleId.EndGame))
      } else {
        const movedCard = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex)
        this.memorize(!this.remind(Memory.BonusAction) ? Memory.RemainingElementValue : Memory.RemainingBonusElementValue, this.elementValue - animalProperties[movedCard.id].cost)

        moves.push(this.startRule(RuleId.RecruitingAnimals))
      }
    }

    return moves
  }

}