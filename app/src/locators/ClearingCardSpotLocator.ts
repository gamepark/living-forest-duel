import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { clearingCardDescription } from '../material/ClearingCardDescription'

class ClearingCardSpotLocator extends Locator {
  parentItemType = MaterialType.ClearingCard

  getParentItem(location: Location) {
    return clearingCardDescription.staticItems.find(item => item.location.x === location.x)
  }

  getItemCoordinates(item: MaterialItem) {
    if (item.id === MaterialType.FireToken) {
      return { x: 1.5 }
    } else {
      return { x: -2, y: -1 }
    }
  }
}

export const clearingCardSpotLocator = new ClearingCardSpotLocator()