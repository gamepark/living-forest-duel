import { ListLocator } from '@gamepark/react-game'
import { animalCardDescription } from '../material/AnimalCardDescription'
import { clearingLineLocator } from './ClearingLineLocator'

class RecruitmentLineLocator extends ListLocator {
  // gap.z is 0 to prevent negative translateZ: https://gamepark.github.io/#/troubleshooting/cannot-click-item
  gap = { x: animalCardDescription.width + 1, z: 0 }
  coordinates = { y: clearingLineLocator.coordinates.y + 11 }
}

export const recruitmentLineLocator = new RecruitmentLineLocator()