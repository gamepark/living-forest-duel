import { ListLocator } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"
import { animalCardDescription } from "../material/AnimalCardDescription"
import { sharedHelpLineLocator } from "./SharedHelpLineLocator"
import { spiritCardDescription } from "../material/SpiritCardDescription"
import { treeTokenLocator } from "./TreeTokenLocator"

class PlayerHelpLineLocator extends ListLocator {
  gap = { x: animalCardDescription.width + 1 }
  maxCount = 4
  
  getCoordinates(location: Location) {
    return {
      x: treeTokenLocator.getCoordinates(location).x + spiritCardDescription.width + 2,
      y: sharedHelpLineLocator.coordinates.y + animalCardDescription.height + 2
    }
  }
}

export const playerHelpLineLocator = new PlayerHelpLineLocator()
