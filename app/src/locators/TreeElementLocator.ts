import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'

class TreeElementLocator extends Locator {
  parentItemType = MaterialType.TreeCard
  positionOnParent = { x: 15, y: 15 }
  locationDescription = new LocationDescription({ width: 1.8, height: 1.1, borderRadius: 0.3 })
}

export const treeElementLocator = new TreeElementLocator()