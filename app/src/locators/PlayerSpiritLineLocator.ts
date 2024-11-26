import { ListLocator } from "@gamepark/react-game"
import { animalCardDescription } from "../material/AnimalCardDescription"
import { treeTokenLocator } from "./TreeTokenLocator"
import { treeTokenDescription } from "../material/TreeTokenDescription"
import { Location } from "@gamepark/rules-api"
import { spiritCardDescription } from "../material/SpiritCardDescription"

class PlayerSpiritLineLocator extends ListLocator {
  gap = { x: animalCardDescription.width + 1 }
  
  getCoordinates(location: Location) {
    return {
      x: treeTokenLocator.getCoordinates(location).x + spiritCardDescription.width + 2,
      y: treeTokenLocator.getCoordinates(location).y +  + treeTokenDescription.height + 0.5
    }
  }

}

export const playerSpiritLineLocator = new PlayerSpiritLineLocator()
