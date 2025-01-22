import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

class AnimalCostLocator extends Locator {
  parentItemType = MaterialType.AnimalCard
  positionOnParent = { x: 84, y: 88.5 }
  locationDescription = new LocationDescription({ width: 1.3, height: 1.3, borderRadius: 1 })
}

export const animalCostLocator = new AnimalCostLocator()