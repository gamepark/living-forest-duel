import { Season } from '@gamepark/living-forest-duel/Season'
import { DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { sharedHelpLineLocator } from './SharedHelpLineLocator'
import { animalCardDescription } from '../material/AnimalCardDescription'

class TreeTokenLocator extends DeckLocator {
  getCoordinates(location: Location) {
    return {
      x: location.id === Season.Summer ? -30 : 0,
      y: sharedHelpLineLocator.coordinates.y + animalCardDescription.height + 2
    }
  }
}

export const treeTokenLocator = new TreeTokenLocator()