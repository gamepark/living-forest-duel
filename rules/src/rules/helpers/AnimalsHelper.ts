import { MaterialGame, MaterialRulesPart } from "@gamepark/rules-api";
import { Animal, animalProperties, CardPattern } from "../../material/Animal";
import { minBy, sumBy } from "lodash";

export class AnimalsHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
  }

  getAnimalsCostSum(animalsIds: number[]) {
    return this.getCostSum(this.getAnimalsProperties(animalsIds))
  }

  getAnimalsMinCost(animalsIds: number[]) {
    return this.getMinCostElement(this.getAnimalsProperties(animalsIds))?.cost
  }

  getAnimalsProperties(animalsIds: number[]) {
    const filteredProperties = Object.keys(animalProperties).reduce((acc, key) => {
      if (animalsIds.includes(Number(key))) {
        acc[key] = animalProperties[Number(key) as Animal]
      }
      return acc
    }, {} as Record<string, any>)

    return filteredProperties
  }

  getCostSum(properties: Partial<Record<Animal, CardPattern>>) {
    return sumBy(Object.values(properties), 'cost')
  }

  getMinCostElement(properties: Partial<Record<Animal, CardPattern>>) {
    return minBy(Object.values(properties), 'cost')
  }

}