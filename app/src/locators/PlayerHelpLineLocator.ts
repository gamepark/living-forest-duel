import { ListLocator } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"
import { animalCardDescription } from "../material/AnimalCardDescription"
import { Season } from "@gamepark/living-forest-duel/Season"
import { sharedDeckLocator } from "./SharedDeckLocator"
import { sharedHelpLineLocator } from "./SharedHelpLineLocator"

class PlayerHelpLineLocator extends ListLocator {
  gap = { x: animalCardDescription.width + 1 }
  maxCount = 3
  
  getCoordinates(location: Location<number, number>) {
    return {
      x: location.id === Season.Summer ? sharedDeckLocator.coordinates.x : sharedDeckLocator.coordinates.x + animalCardDescription.width * 4 + 4,
      y: sharedHelpLineLocator.coordinates.y + animalCardDescription.height + 2
    }
  }
}

export const playerHelpLineLocator = new PlayerHelpLineLocator()
