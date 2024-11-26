import { MaterialContext, PileLocator } from "@gamepark/react-game"
import { Location, MaterialItem } from "@gamepark/rules-api"
import { sharedHelpLineLocator } from "./SharedHelpLineLocator"
import { treeTokenDescription } from "../material/TreeTokenDescription"
import { treeTokenLocator } from "./TreeTokenLocator"

class PlayerFireStockLocator extends PileLocator {
  radius = 1.5

  getCoordinates(location: Location<number, number>, _context: MaterialContext<number, number, number>) {
    return {
      x: treeTokenLocator.getCoordinates(location).x,
      y: sharedHelpLineLocator.coordinates.y + treeTokenDescription.height * 2
    }
  }

  getPileId(item: MaterialItem) {
    return item.id
  }
}

export const playerFireStockLocator = new PlayerFireStockLocator()