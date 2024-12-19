import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Animal, animalProperties } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Element, elements } from '../Season'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { ElementsHelper } from './helpers/ElementsHelper'
import { FireHelper } from './helpers/FireHelper'
import { TreesHelper } from './helpers/TreesHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayerUseActionTokenRule extends PlayerTurnRule {
  onRuleStart() {
    this.memorize(Memory.PlantedTreesTypes, [])
    this.memorize(Memory.RemainingBonuses, [])
    return []
  }

  getPlayerMoves() {
    return this.availableActionTokens.length > 0 ? this.getAvailableActions() : []
  }

  get availableActionTokens() {
    return this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.player)
  }

  getAvailableActions() {
    const moves: MaterialMove[] = []
    const sharedCards = this.material(MaterialType.AnimalCard).location(LocationType.SharedHelpLine).sort(item => -item.location.x!)
    // Using the CardElements type to store the id of the animal card id that is available in this action
    const elementCardIndexes: Partial<Record<Element, number>> = {}

    for (const [index, card] of sharedCards.entries) {
      const cardProperties = animalProperties[card.id as Animal]
      for (const element of elements) {
        if (elementCardIndexes[element] === undefined && cardProperties.elements[element] !== undefined) {
          elementCardIndexes[element] = index
        }
      }

      // If we already have the 4 positions, exit the loop
      if (elements.every(element => elementCardIndexes[element] !== undefined)) {
        break
      }
    }

    // Element must not be taken
    for (const element of elements) {
      if (this.material(MaterialType.ActionToken).location(LocationType.PointElement).locationId(element).parent(elementCardIndexes[element]).length) {
        delete elementCardIndexes[element]
      }
    }

    // Validate the positions. At least 1 element between the action token and the previous one.
    const actionTokenOnCard = this.material(MaterialType.ActionToken).id(this.player).location(LocationType.PointElement).getItem()
    if (actionTokenOnCard) {
      const element = actionTokenOnCard.location.id as Element
      const tokenX = this.material(MaterialType.AnimalCard).getItem(actionTokenOnCard.location.parent!).location.x!
      const cardsAfterToken = sharedCards.location(l => l.x! > tokenX)
      if (cardsAfterToken.id<Animal>(animal => animalProperties[animal].elements[element] !== undefined).length < 2) {
        delete elementCardIndexes[element]
      }
    }

    // Create the moves
    for (const element of elements) {
      const elementCardIndex = elementCardIndexes[element]
      if (elementCardIndex !== undefined) {
        if (this.elementCanBePlayed(element)) {
          moves.push(...this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.player)
            .moveItems({
              type: LocationType.PointElement,
              parent: elementCardIndex,
              id: element
            })
          )
        }
      }
    }

    return moves
  }

  beforeItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.PointElement) {
      switch (move.location.id as Element) {
        case Element.Sun:
          new ElementsHelper(this.game).setRemainingElementValue(Element.Sun)
          return [this.startRule(RuleId.RecruitingAnimals)]
        case Element.Water:
          new ElementsHelper(this.game).setRemainingElementValue(Element.Water)
          return [this.startRule(RuleId.ExtinguishingFire)]
        case Element.Plant:
          new ElementsHelper(this.game).setRemainingElementValue(Element.Plant)
          return [this.startRule(RuleId.PlantingProtectiveTree)]
        case Element.Wind:
          new ElementsHelper(this.game).setRemainingElementValue(Element.Wind)
          return [this.startRule(RuleId.AdvancingOnibi)]
      }
    }
    return []
  }

  elementCanBePlayed(element: Element) {
    const elementValue = new ElementsHelper(this.game).getElementValue(element)
    if (elementValue > 0) {
      switch (element) {
        case Element.Sun:
          return new AnimalsHelper(this.game).canAnimalsBeRecruited(elementValue)
        case Element.Water:
          return new FireHelper(this.game).canFireBeExtinguished(elementValue)
        case Element.Plant:
          return new TreesHelper(this.game).canTreesBePlanted(elementValue)
        case Element.Wind:
          return true // It's only false if elementValue < 1
      }
    }

    return false
  }
}