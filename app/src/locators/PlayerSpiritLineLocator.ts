import { ListLocator } from "@gamepark/react-game"
import { animalCardDescription } from "../material/AnimalCardDescription"
import { treeTokenLocator } from "./TreeTokenLocator"
import { treeTokenDescription } from "../material/TreeTokenDescription"
import { Location } from "@gamepark/rules-api"
import { spiritCardDescription } from "../material/SpiritCardDescription"

class PlayerSpiritLineLocator extends ListLocator {
  gap = { x: animalCardDescription.width + 1 }
  
  getCoordinates(location: Location) {
    const { x, y } = treeTokenLocator.getCoordinates(location)
    return {
      x: x + spiritCardDescription.width + 2,
      y: y +  + treeTokenDescription.height + 0.5
    }
  }

}

export const playerSpiritLineLocator = new PlayerSpiritLineLocator()
