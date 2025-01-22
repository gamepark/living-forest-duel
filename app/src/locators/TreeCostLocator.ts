import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

class TreeCostLocator extends Locator {
  parentItemType = MaterialType.TreeCard
  positionOnParent = { x: 83.5, y: 83.5 }
  locationDescription = new LocationDescription({ width: 1.3, height: 1.3, borderRadius: 1 })
}

export const treeCostLocator = new TreeCostLocator()