import { MaterialGame, MaterialRulesPart } from "@gamepark/rules-api";
import { MaterialType } from "../../material/MaterialType";
import { LocationType } from "../../material/LocationType";
import { Animal, animalProperties } from "../../material/Animal";
import { Element } from "../../Season";
import { Memory } from "../Memory";
import { Tree, treeProperties } from "../../material/Tree";

export class ElementsHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
  }

  setRemainingElementValue(elementType: Element) {
    const action: ActionType = { element: elementType, remainingElementValue: this.getElementValue(elementType, this.player) }
    this.memorize(Memory.CurrentAction, action)
  }

  getRemainingElementValue() {
    return this.remind(Memory.RemainingBonuses).length === 0 ? this.remind(Memory.CurrentAction).remainingElementValue : this.getRemainingBonusElementValue()
  }

  setRemainingBonusElementValue(elementType: Element) {
    this.updateRemainingElementValue(this.getElementValue(elementType, this.player))
  }

  getRemainingBonusElementValue() {
    const bonus: ActionType = this.remind(Memory.RemainingBonuses).slice(-1)[0]
    if (bonus !== undefined) {
      return bonus.remainingElementValue
    } else {
      return 0
    }
  }

  updateRemainingElementValue(newValue: number) {
    if (!this.isBonusAction()) {
      const currentAction = this.remind(Memory.CurrentAction)
      currentAction.remainingElementValue = newValue
      this.memorize(Memory.CurrentAction, currentAction)
    } else {
      const bonuses: ActionType[] = this.remind(Memory.RemainingBonuses)
      bonuses[bonuses.length - 1].remainingElementValue = newValue
      this.memorize(Memory.RemainingBonuses, bonuses)
    }
  }

  removeLastBonusElement() {
    const remainingBonuses = this.remind(Memory.RemainingBonuses)
    remainingBonuses.pop()
    this.memorize(Memory.RemainingBonuses, remainingBonuses)

    return remainingBonuses
  }

  isBonusAction() {
    return this.remind(Memory.RemainingBonuses).length > 0
  }

  // lastTokenX indicates the position from where we want to start calculating
  // When playing the token we use the token position, but we don't have it before to check if there are enough points to play
  getElementValue(elementType: Element, player: number | undefined, lastTokenX?: number | undefined) {
    let elementValue = 0
    const tokensLocations = this.material(MaterialType.ActionToken)
      .location(l => l.type === LocationType.ActionToken && l.y === elementType && (lastTokenX !== undefined ? l.x! < lastTokenX : true))
      .getItems()
      .sort((a, b) => b.location.x! - a.location.x!)
    const tokenLocationX = lastTokenX ?? this.material(MaterialType.AnimalCard).location(LocationType.SharedHelpLine).getQuantity() - 1
    const previousTokenLocationX = tokensLocations.length > 0 ? tokensLocations[0].location.x! : -1
    for (let x = tokenLocationX!; x > previousTokenLocationX!; x--) {
      const card = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine && l.x === x).getItem<Animal>()!
      const cardProperties = animalProperties[card.id]
      elementValue += cardProperties.elements[elementType]! ?? 0
    }

    // Add the personal value
    const playerAnimals = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.PlayerHelpLine && l.player === player).getItems<Animal>()
    for (const playerCard of playerAnimals) {
      const cardProperties = animalProperties[playerCard.id]
      elementValue += cardProperties.elements[elementType]! ?? 0
    }

    // Add the player forest
    const playerTrees = this.material(MaterialType.TreeCard).location(l => l.type === LocationType.PlayerForest && l.player === player).getItems()
    for (const playerCard of playerTrees) {
      const cardProperties = treeProperties[playerCard?.id as Tree]
      elementValue += cardProperties?.element === elementType ? cardProperties?.elementValue : 0
    }

    return elementValue
  }
}

export type ActionType = {
  element: Element,
  remainingElementValue: number
}