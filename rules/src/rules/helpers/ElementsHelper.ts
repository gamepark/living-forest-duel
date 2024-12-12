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
    this.memorize(Memory.RemainingElementValue, this.getElementValue(elementType, this.player))
  }

  setRemainingBonusElementValue(elementType: Element) {
    this.memorize(Memory.RemainingBonusElementValue, this.getElementValue(elementType, this.player))
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