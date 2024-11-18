import { MaterialGame, MaterialRulesPart } from "@gamepark/rules-api";
import { Animal, animalProperties, CardPattern } from "../../material/Animal";
import { sumBy } from "lodash";

export class AnimalsHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
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

  getAnimalsCostSum(animalsIds: number[]) {
    return this.getCostSum(this.getAnimalsProperties(animalsIds))
  }

  // getAnimalsTypeCount(animalsIds: number[]) {
  //   return this.getTypeCount(this.getAnimalsProperties(animalsIds))
  // }

  getCostSum(properties: Partial<Record<Animal, CardPattern>>) {
    return sumBy(Object.values(properties), 'cost')
  }

  // getTypeCount(properties: Partial<Record<Animal, CardPattern>>) {
  //   return countBy(Object.values(properties), 'type')
  // }
}