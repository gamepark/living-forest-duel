import { DeckLocator } from '@gamepark/react-game'
import { animalCardDescription } from '../material/AnimalCardDescription'
import { sharedDeckLocator } from './SharedDeckLocator'

class SharedDiscardPileLocator extends DeckLocator {
  coordinates = { x: sharedDeckLocator.coordinates.x - animalCardDescription.width - 2, y: sharedDeckLocator.coordinates.y }
}

export const sharedDiscardPileLocator = new SharedDiscardPileLocator()