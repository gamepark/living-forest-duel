import { MaterialGame, MaterialRulesPart } from "@gamepark/rules-api";
import { MaterialType } from "../../material/MaterialType";
import { LocationType } from "../../material/LocationType";
import { Animal, animalProperties, CardElements } from "../../material/Animal";
import { Element } from "../../Season";
import { Memory } from "../Memory";
import { AnimalsHelper } from "./AnimalsHelper";

export class ElementsHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
  }

  setRemainingElementValue(elementType: Element) {
    // let elementValue = 0

    // const tokensLocations = this.material(MaterialType.ActionToken)
    //   .location(l => l.type === LocationType.ActionToken && l.y === elementType)
    //   .getItems()
    //   .sort((a,b) => b.location.x! - a.location.x!)
    // const tokenLocationX = tokensLocations[0].location.x
    // const previousTokenLocationX = tokensLocations[1]?.location.x ?? -1
    // for (let x = tokenLocationX!; x > previousTokenLocationX; x--) {
    //   const card = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine && l.x === x).getItem()
    //   const cardProperties = animalProperties[card?.id as Animal]
    //   elementValue += cardProperties?.elements[Element[elementType].toLowerCase() as keyof CardElements]! ?? 0
    // }
    // // Add the personal value
    // const playerCardsids = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.PersonalHelpLine && l.id === this.player).getItems().map(card => card.id)
    // elementValue += new AnimalsHelper(this.game, this.player).getAnimalsCostSum(playerCardsids)

    this.memorize(Memory.RemainingElementValue, this.getElementValue(elementType))
  }

  setRemainingBonusElementValue(elementType: Element) {
    // let elementValue = 0

    // const tokensLocations = this.material(MaterialType.ActionToken)
    //   .location(l => l.type === LocationType.ActionToken && l.y === elementType)
    //   .getItems()
    //   .sort((a,b) => b.location.x! - a.location.x!)
    // const tokenLocationX = tokensLocations[0].location.x
    // const previousTokenLocationX = tokensLocations[1]?.location.x ?? -1
    // for (let x = tokenLocationX!; x > previousTokenLocationX; x--) {
    //   const card = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine && l.x === x).getItem()
    //   const cardProperties = animalProperties[card?.id as Animal]
    //   elementValue += cardProperties?.elements[Element[elementType].toLowerCase() as keyof CardElements]! ?? 0
    // }
    // // Add the personal value
    // const playerCardsids = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.PersonalHelpLine && l.id === this.player).getItems().map(card => card.id)
    // elementValue += new AnimalsHelper(this.game, this.player).getAnimalsCostSum(playerCardsids)

    this.memorize(Memory.RemainingBonusElementValue, this.getElementValue(elementType))
  }

  getElementValue(elementType: Element) {
    let elementValue = 0

    const tokensLocations = this.material(MaterialType.ActionToken)
      .location(l => l.type === LocationType.ActionToken && l.y === elementType)
      .getItems()
      .sort((a,b) => b.location.x! - a.location.x!)
    const tokenLocationX = tokensLocations[0].location.x
    const previousTokenLocationX = tokensLocations[1]?.location.x ?? -1
    for (let x = tokenLocationX!; x > previousTokenLocationX; x--) {
      const card = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine && l.x === x).getItem()
      const cardProperties = animalProperties[card?.id as Animal]
      elementValue += cardProperties?.elements[Element[elementType].toLowerCase() as keyof CardElements]! ?? 0
    }
    // Add the personal value
    const playerCardsids = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.PersonalHelpLine && l.id === this.player).getItems().map(card => card.id)
    elementValue += new AnimalsHelper(this.game, this.player).getAnimalsCostSum(playerCardsids)

    console.log("Computed element value: ", elementValue)
    return elementValue
  }

}