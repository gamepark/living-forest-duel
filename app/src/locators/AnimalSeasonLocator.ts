import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

class AnimalSeasonLocator extends Locator {
  parentItemType = MaterialType.AnimalCard
  positionOnParent = { x: 18, y: 87 }
  locationDescription = new LocationDescription({ width: 1.3, height: 1.3, borderRadius: 1 })
}

export const animalSeasonLocator = new AnimalSeasonLocator()