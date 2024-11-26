import { MaterialGame, MaterialRulesPart } from "@gamepark/rules-api";
import { Animal, animalProperties, AnimalSeason, AnimalType, CardPattern, getAnimalSeason } from "../../material/Animal";
import { countBy, minBy, sumBy } from "lodash";
import { LocationType } from "../../material/LocationType";
import { MaterialType } from "../../material/MaterialType";

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

  checkTooManySolitaryAnimals(season: number) {
    const animalsIds = this.material(MaterialType.AnimalCard)
      .location(l => l.type === LocationType.SharedHelpLine || l.type === LocationType.PlayerHelpLine)
      .filter(animal => [AnimalSeason.Common, season].includes(getAnimalSeason(animal.id)))
      .getItems().map(animal => animal.id)
    const animalsProperties = this.getAnimalsProperties(animalsIds)
    const totalSolitary = countBy(animalsProperties, animal => animal.type === AnimalType.Solitary).true || 0
    const totalGregarious = countBy(animalsProperties, animal => animal.type === AnimalType.Gregarius).true || 0
    if (totalSolitary - totalGregarious >= 3) {
      return true
    }

    return false
  }

}