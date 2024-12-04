import { DeckLocator } from "@gamepark/react-game";
import { Coordinates, Location } from "@gamepark/rules-api";
import { treeCardDescription } from "../material/TreeCardDescription";
import { fireStockLocator } from "./FireStockLocator";
import { clearingLineLocator } from "./ClearingLineLocator";

class TreeDeckSpotLocator extends DeckLocator {
  getCoordinates(location: Location<number, number>): Partial<Coordinates> {
    return {
      // x: fireStockLocator.coordinates.x + (location.id - 1) * treeCardDescription.width + (2 * location.id) + 1,
      x: fireStockLocator.coordinates.x + (location.id - 1) * treeCardDescription.width * 1.15 + 1,
      y: clearingLineLocator.coordinates.y - 10
    }
  }
}

export const treeDeckSpotLocator = new TreeDeckSpotLocator()