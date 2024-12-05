import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

import { AnimalsHelper } from './helpers/AnimalsHelper'
import { Animal, animalProperties, getAnimalSeason } from '../material/Animal'
import { CustomMoveType } from './CustomMoveType'
import { ElementsHelper } from './helpers/ElementsHelper'
import { Element } from '../Season'

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
    // let lastPosX = undefined
    // if (!this.remind(Memory.BonusAction)) {
    //   const playerActionTokens = this.material(MaterialType.ActionToken).id(this.player).location(l => l.type === LocationType.ActionToken && l.y === Element.Sun).getItems()
    //   const lastActionToken = playerActionTokens.reduce((max, token) => token.location.x! > max.location.x! ? token : max, playerActionTokens[0])
    //   lastPosX = lastActionToken.location.x!
    // }
    // if (this.elementValue < new ElementsHelper(this.game, this.player).getElementValue(Element.Sun, this.player, lastPosX)) {
    // Only can pass if at least one animal was taken
    if (this.elementValue < new ElementsHelper(this.game, this.player).getElementValue(Element.Sun, this.player)) {
      moves.push(this.customMove(CustomMoveType.ActionPass))
    }  

    const restOfCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .id<Animal>(animal => getAnimalSeason(animal) !== this.player && this.elementValue >= animalProperties[animal].cost!)
    moves.push(...restOfCards.moveItems({ type: LocationType.SharedDiscardPile }))

    return moves
  }

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.ActionPass)(move)) {
      return [this.startRule(RuleId.RefillRecruitmentLine)]
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.AnimalCard)(move) && (move.location.type === LocationType.PlayerHelpLine || move.location.type === LocationType.SharedDiscardPile)) {
      // Check winning condition
      if (this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.RecruitmentLine)
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