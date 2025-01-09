import { ListLocator } from '@gamepark/react-game'
import { clearingCardDescription } from '../material/ClearingCardDescription'

class ClearingLineLocator extends ListLocator {
  // gap.z is 0 to prevent negative translateZ: https://gamepark.github.io/#/troubleshooting/cannot-click-item
  gap = { x: clearingCardDescription.width + 1, z: 0 }
  coordinates = { y: -15 }
}

export const clearingLineLocator = new ClearingLineLocator()