import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { countBy, minBy } from 'lodash'
import { Animal, animalProperties, AnimalType, CardPattern, isNotOpponentAnimal } from '../../material/Animal'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class AnimalsHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
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

  getMinCostElement(properties: Partial<Record<Animal, CardPattern>>) {
    return minBy(Object.values(properties), 'cost')
  }

  checkTooManySolitaryAnimals(season: number) {
    const animalsIds = this.material(MaterialType.AnimalCard)
      .location(l => l.type === LocationType.SharedHelpLine || l.type === LocationType.PlayerHelpLine)
      .id<Animal>(animal => isNotOpponentAnimal(animal, season))
      .getItems().map(animal => animal.id)
    const animalsProperties = this.getAnimalsProperties(animalsIds)
    const totalSolitary = countBy(animalsProperties, animal => animal.type === AnimalType.Solitary).true || 0
    const totalGregarious = countBy(animalsProperties, animal => animal.type === AnimalType.Gregarius).true || 0
    const difference = totalSolitary - totalGregarious
    // To avoid losing another action after getting a grearious animal
    if (difference > 3 || (difference === 3 && this.material(MaterialType.ActionToken).id(season).location(LocationType.PlayerActionLost).getItems().length === 0)) {
      return true
    }

    return false
  }

  canAnimalsBeRecruited(sunValue: number) {
    const animalsIds = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getItems().map(animal => animal.id)
    const minCost = new AnimalsHelper(this.game, this.player).getAnimalsMinCost(animalsIds) || 0
    // if (minCost > this.remind(Memory.RemainingElementValue)) {
    if (minCost > sunValue) {
      return false
    }

    return true
  }
}