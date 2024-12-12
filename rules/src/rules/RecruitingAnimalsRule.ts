import { CustomMove, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Animal, animalProperties, getAnimalSeason } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Element } from '../Season'
import { CustomMoveType } from './CustomMoveType'

import { AnimalsHelper } from './helpers/AnimalsHelper'
import { ElementsHelper } from './helpers/ElementsHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

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
          ...playerCards.id(card.id).moveItems({ type: LocationType.PlayerHelpLine, player: getAnimalSeason(card.id) })
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
    const lastTokenX = !this.remind(Memory.BonusAction) ? this.material(MaterialType.ActionToken).location(l => l.type === LocationType.ActionToken && l.y === Element.Sun).getItem()?.location.x : undefined
    if (this.elementValue < new ElementsHelper(this.game, this.player).getElementValue(Element.Sun, this.player, lastTokenX)) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }  

    const restOfCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
      .id<Animal>(animal => getAnimalSeason(animal) !== this.player && this.elementValue >= animalProperties[animal].cost!)
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
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.AnimalCard)(move) && (move.location.type === LocationType.PlayerHelpLine || move.location.type === LocationType.SharedDiscardPile)) {
      // Check winning condition
      if (this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.RecruitmentLine)
        .id<Animal>(animal => getAnimalSeason(animal) !== this.player).getQuantity() === 0) {
        moves.push(this.endGame())
      } else {
        const movedCard = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex)
        this.memorize(!this.remind(Memory.BonusAction) ? Memory.RemainingElementValue : Memory.RemainingBonusElementValue, this.elementValue - animalProperties[movedCard.id].cost)

        moves.push(this.startRule(RuleId.RecruitingAnimals))
      }
    }

    return moves
  }

}