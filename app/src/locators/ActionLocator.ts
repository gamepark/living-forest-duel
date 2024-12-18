import { MaterialType } from "@gamepark/living-forest-duel/material/MaterialType"
import { DropAreaDescription, Locator } from "@gamepark/react-game"
import { Location } from '@gamepark/rules-api'

class ActionLocator extends Locator {
  parentItemType = MaterialType.AnimalCard

  getPositionOnParent(location: Location) {
    return { x: 52, y: 16.9 + location.id * 14.1 }
  }

  locationDescription = new DropAreaDescription({ width: 2.7, height: 1 })
}

export const actionLocator = new ActionLocator()