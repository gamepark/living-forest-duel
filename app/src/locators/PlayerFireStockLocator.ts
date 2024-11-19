import { Season } from "@gamepark/living-forest-duel/Season"
import { MaterialContext, PileLocator } from "@gamepark/react-game"
import { Location, MaterialItem } from "@gamepark/rules-api"
import { sharedDeckLocator } from "./SharedDeckLocator"
import { sharedHelpLineLocator } from "./SharedHelpLineLocator"
import { animalCardDescription } from "../material/AnimalCardDescription"
import { treeTokenDescription } from "../material/TreeTokenDescription"

class PlayerFireStockLocator extends PileLocator {
  radius = 1.5

  getCoordinates(location: Location<number, number>, _context: MaterialContext<number, number, number>) {
    return {
      x: location.id === Season.Summer ? sharedDeckLocator.coordinates.x - treeTokenDescription.width - 0.5 : sharedDeckLocator.coordinates.x + animalCardDescription.width * 4 + 4 - treeTokenDescription.width,
      y: sharedHelpLineLocator.coordinates.y + treeTokenDescription.height * 2
    }
  }

  getPileId(item: MaterialItem) {
    return item.id
  }
}

export const playerFireStockLocator = new PlayerFireStockLocator()