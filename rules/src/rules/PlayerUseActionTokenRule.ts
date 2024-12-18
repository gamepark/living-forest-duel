import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Animal, animalProperties, CardElements } from '../material/Animal'
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
    const maxElements: CardElements = {
      [Element.Sun]: -1,
      [Element.Water]: -1,
      [Element.Plant]: -1,
      [Element.Wind]: -1
    }

    for (const card of sharedCards.getItems<Animal>()) {
      const cardProperties = animalProperties[card.id]
      for (const element of elements) {
        if (maxElements[element]! < 0 && cardProperties.elements[element] !== undefined) {
          maxElements[element] = card.id
        }
      }

      // If we already have the 4 positions, exit the loop
      if (Object.values(maxElements).every(value => value !== undefined && value > 0)) {
        break
      }
    }

    // Validate the positions. At least 1 element between the action token and the previous one.
    const actionTokenOnCard = this.material(MaterialType.ActionToken).id(this.player).location(LocationType.ActionToken).getItem()
    if (actionTokenOnCard) {
      const element = actionTokenOnCard.location.y as Element
      const cardsAfterToken = sharedCards.location(l => l.x! > actionTokenOnCard.location.x!)
      if (cardsAfterToken.id<Animal>(animal => animalProperties[animal].elements[element] !== undefined).length < 2) {
        maxElements[element] = -1
      }
    }

    // Create the moves
    for (const element of elements) {
      const elementCard = maxElements[element]!
      if (elementCard > 0) {
        const card = this.material(MaterialType.AnimalCard).id(elementCard)
        if (this.elementCanBePlayed(element, card.getItem()?.location.x!)) {
          moves.push(...this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.player)
            .moveItems({
              type: LocationType.ActionToken,
              x: card.getItem()?.location.x,
              y: element,
              parent: card.getIndex()
            })
          )
        }
      }
    }

    return moves
  }

  beforeItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.ActionToken) {
      switch (move.location.y) {
        case Element.Sun:
          new ElementsHelper(this.game, this.player).setRemainingElementValue(Element.Sun)
          moves.push(this.startRule(RuleId.RecruitingAnimals))
          break
        case Element.Water:
          new ElementsHelper(this.game, this.player).setRemainingElementValue(Element.Water)
          moves.push(this.startRule(RuleId.ExtinguishingFire))
          break
        case Element.Plant:
          new ElementsHelper(this.game, this.player).setRemainingElementValue(Element.Plant)
          moves.push(this.startRule(RuleId.PlantingProtectiveTree))
          break
        case Element.Wind:
          new ElementsHelper(this.game, this.player).setRemainingElementValue(Element.Wind)
          moves.push(this.startRule(RuleId.AdvancingOnibi))
          break
      }
    }

    return moves
  }

  elementCanBePlayed(element: Element, cardPosX: number) {
    const elementValue = new ElementsHelper(this.game, this.player).getElementValue(element, this.player, cardPosX)
    if (elementValue > 0) {
      switch (element) {
        case Element.Sun:
          return new AnimalsHelper(this.game, this.player).canAnimalsBeRecruited(elementValue)
        case Element.Water:
          return new FireHelper(this.game, this.player).canFireBeExtinguished(elementValue)
        case Element.Plant:
          return new TreesHelper(this.game, this.player).canTreesBePlanted(elementValue)
        case Element.Wind:
          return true // It's only false if elementValue < 1
      }
    }

    return false
  }
}