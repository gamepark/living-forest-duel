import { Season } from '@gamepark/living-forest-duel/Season'
import { DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { clearingLineLocator } from './ClearingLineLocator'

class VaranDecksLocator extends DeckLocator {
  getCoordinates(location: Location) {
    return {
      x: location.id === Season.Summer ? -30 : 30,
      y: clearingLineLocator.coordinates.y
    }
  }
}

export const varanDecksLocator = new VaranDecksLocator()