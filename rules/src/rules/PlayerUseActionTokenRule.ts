import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { Animal, animalProperties, CardElements } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Element, elements } from '../Season'
import { ElementsHelper } from './helpers/ElementsHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { FireHelper } from './helpers/FireHelper'
import { TreesHelper } from './helpers/TreesHelper'

export class PlayerUseActionTokenRule extends PlayerTurnRule {
  onRuleStart() {
    if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player).getQuantity() === 0) {
      return [this.startRule(RuleId.EndTurn)]
    } else {
      this.memorize(Memory.PlantedTreesTypes, [])
      this.memorize(Memory.BonusAction, 0)
      this.memorize(Memory.UseSankiOnOtherPlayerTurn, false)
      return []
    }
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    // Add one action token to one card in the shared help line
    if (this.availableActionTokens.getQuantity() > 0) {
      moves.push(...this.getAvailableActions())
    }

    return moves
  }

  get availableActionTokens() {
    return this.material(MaterialType.ActionToken).id(this.player).location(LocationType.PlayerActionSupply)
  }

  getAvailableActions() {
    const moves: MaterialMove[] = []
    const sharedCards = this.material(MaterialType.AnimalCard).location(LocationType.SharedHelpLine)
    // Using the CardElements type to store the id of the animal card id that is available in this action
    const maxElements: CardElements = {
      [Element.Sun]: -1,
      [Element.Water]: -1,
      [Element.Plant]: -1,
      [Element.Wind]: -1
    }

    for (let x = sharedCards.getQuantity() - 1; x >= 0; x--) {
      const card = sharedCards.location(l => l.x === x).getItem<Animal>()!
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
    for (const element of elements) {
      // const elementIndex = Object.keys(maxElements).indexOf(element) + 1
      // const elementIndex = element + 1
      let cardsWithElement = 0
      for (let x = this.material(MaterialType.AnimalCard).id(maxElements[element]).getItem()?.location.x; x! >= 0; x!--) {
        const card = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine && l.x === x).getItem<Animal>()!
        const cardProperties = animalProperties[card.id]
        if (cardProperties.elements[element] !== undefined) {
          if (this.material(MaterialType.ActionToken).location(l => l.type === LocationType.ActionToken && l.x === card.location.x && l.y === element).getQuantity() > 0) {
            maxElements[element] = -1
            break
          } else {
            cardsWithElement++
            if (cardsWithElement == 2) break
          }
        }
      }
    }

    // Create the moves
    for (const element of elements) {
      const elementCard = maxElements[element]!
      if (elementCard > 0) {
        const card = this.material(MaterialType.AnimalCard).id(elementCard)
        if (this.elementCanBePlayed(element, card.getItem()?.location.x!)) {
          moves.push(...this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player)
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

  beforeItemMove(move: ItemMove<number, number, number>, _context?: PlayMoveContext) {
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