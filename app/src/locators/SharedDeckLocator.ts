import { DeckLocator } from '@gamepark/react-game'
import { sharedHelpLineLocator } from './SharedHelpLineLocator'
import { animalCardDescription } from '../material/AnimalCardDescription'

class SharedDeckLocator extends DeckLocator {
  coordinates = { x: -28 + animalCardDescription.width, y: sharedHelpLineLocator.coordinates.y }
}

export const sharedDeckLocator = new SharedDeckLocator()