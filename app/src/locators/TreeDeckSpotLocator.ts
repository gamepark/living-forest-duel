import { DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { treeCardDescription } from '../material/TreeCardDescription'
import { clearingLineLocator } from './ClearingLineLocator'
import { fireStockLocator } from './FireStockLocator'

class TreeDeckSpotLocator extends DeckLocator {
  getCoordinates(location: Location) {
    return {
      x: fireStockLocator.coordinates.x + location.id * treeCardDescription.width * 1.15 + 1,
      y: clearingLineLocator.coordinates.y - 10
    }
  }
}

export const treeDeckSpotLocator = new TreeDeckSpotLocator()