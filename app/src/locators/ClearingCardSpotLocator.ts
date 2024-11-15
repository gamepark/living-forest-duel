import { MaterialType } from "@gamepark/living-forest-duel/material/MaterialType";
import { Location, MaterialItem } from '@gamepark/rules-api'
import { ItemContext, Locator } from "@gamepark/react-game";
import { clearingCardDescription } from "../material/ClearingCardDescription";

class ClearingCardSpotLocator extends Locator {
  parentItemType = MaterialType.ClearingCard

  getParentItem(location: Location) {
    return clearingCardDescription.staticItems.find(item => item.location.x === location.x)
  }

  getItemCoordinates(item: MaterialItem, context: ItemContext) {
    const { x, y } = super.getItemCoordinates(item, context)
    if (item.id === MaterialType.FireToken) {
      return { y: y! + 0.6 }
    } else {
      return { x, y }
    }
  }
}

export const clearingCardSpotLocator = new ClearingCardSpotLocator()