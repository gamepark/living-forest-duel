import { MaterialRulesPart } from '@gamepark/rules-api'
import { countBy, minBy } from 'lodash'
import { Animal, animalProperties, AnimalType, CardPattern, isVaran } from '../../material/Animal'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class AnimalsHelper extends MaterialRulesPart {
  getAnimalsMinCost(animalsIds: Animal[]) {
    return this.getMinCostElement(this.getAnimalsProperties(animalsIds))?.cost
  }

  getAnimalsProperties(animalsIds: Animal[]): Record<Animal, CardPattern> {
    const animalsProperties = animalsIds.reduce((acc, animalId) => {
      if (animalProperties[animalId]) {
        acc[animalId] = animalProperties[animalId]
      }
      return acc
    }, {} as Record<Animal, CardPattern>)

    return animalsProperties
  }

  getMinCostElement(properties: Partial<Record<Animal, CardPattern>>) {
    return minBy(Object.values(properties), 'cost')
  }

  checkTooManySolitaryAnimals(season: number) {
    const animalsIds = this.material(MaterialType.AnimalCard)
      .location(l => l.type === LocationType.SharedHelpLine || (l.type === LocationType.PlayerHelpLine && l.player === season))
      .getItems().map(animal => animal.id)
    const animalsProperties = this.getAnimalsProperties(animalsIds)
    const totalVarans = countBy(animalsIds, id => isVaran(id)).true || 0
    const solitary = Object.entries(animalsProperties).filter(([key, properties]) => !isVaran(Number(key) as Animal) && properties.type === AnimalType.Solitary).length
    const totalSolitary = totalVarans + solitary

    const totalGregarious = countBy(animalsProperties, animal => animal.type === AnimalType.Gregarious).true || 0
    const difference = totalSolitary - totalGregarious
    // To avoid losing another action after getting a grearious animal
    if (difference > 3 || (difference === 3 && this.material(MaterialType.ActionToken).location(LocationType.PlayerActionLost).player(season).getItems().length === 0)) {
      return true
    }

    return false
  }

  canAnimalsBeRecruited(sunValue: number) {
    const animalsIds = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getItems().map(animal => animal.id)
    const minCost = this.getAnimalsMinCost(animalsIds) || 0

    if (minCost > sunValue) {
      return false
    }

    return true
  }
}