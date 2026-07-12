import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { countBy, minBy } from 'es-toolkit/compat'
import { Animal, animalProperties, AnimalType, CardPattern, isVaran } from '../../material/Animal'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Season } from '../../Season'

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

  countSolitary(season: Season) {
    const animalsIds = this.material(MaterialType.AnimalCard)
      .location(l => l.type === LocationType.SharedHelpLine || (l.type === LocationType.PlayerHelpLine && l.player === season))
      .getItems().map(animal => animal.id)
    const animalsProperties = this.getAnimalsProperties(animalsIds)
    const totalVarans = countBy(animalsIds, id => isVaran(id)).true || 0
    const solitary = Object.entries(animalsProperties).filter(([key, properties]) => !isVaran(Number(key) as Animal) && properties.type === AnimalType.Solitary).length
    const totalSolitary = totalVarans + solitary

    const totalGregarious = countBy(animalsProperties, animal => animal.type === AnimalType.Gregarious).true || 0
    return totalSolitary - totalGregarious
  }

  /**
   * Reconcile the number of Action tokens a player has lost with their current solitary count:
   * 3rd solitary symbol => 1 token lost, 4th solitary symbol => 2nd token lost.
   * Returns the moves needed to lose the missing tokens (never gives tokens back, so a gregarious
   * symbol cancelling a symbol does not restore an already-lost action). Safe to call from any code
   * path that adds a card to a help line, regardless of how many symbols were added since the last check.
   */
  getSolitaryPenaltyMoves(season: Season): MaterialMove[] {
    const solitary = this.countSolitary(season)
    const targetLost = solitary >= 4 ? 2 : solitary >= 3 ? 1 : 0
    const alreadyLost = this.material(MaterialType.ActionToken).location(LocationType.PlayerActionLost).player(season).getQuantity()
    const supply = this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(season)
    const tokensToLose = Math.min(targetLost - alreadyLost, supply.getQuantity())

    const moves: MaterialMove[] = []
    for (let i = 0; i < tokensToLose; i++) {
      // Move one unit at a time so each lost token is a distinct item (PositiveSequenceStrategy)
      moves.push(supply.moveItem({ type: LocationType.PlayerActionLost, player: season }, 1))
    }
    return moves
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