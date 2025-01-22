import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { LocationDescription, Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { clearingCardDescription } from '../material/ClearingCardDescription'

class ClearingCardBonusLocator extends Locator {
  parentItemType = MaterialType.ClearingCard

  getParentItem(location: Location) {
    return clearingCardDescription.staticItems.find(item => item.location.x === location.x)
  }

  positionOnParent = { x: 50, y: 81 }
  locationDescription = new LocationDescription({ width: 1.7, height: 1.7, borderRadius: 1 })
}

export const clearingCardBonusLocator = new ClearingCardBonusLocator()