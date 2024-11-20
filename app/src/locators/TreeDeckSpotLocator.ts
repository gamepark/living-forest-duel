import { DeckLocator } from "@gamepark/react-game";
import { Coordinates, Location } from "@gamepark/rules-api";
import { treeDecksLocator } from "./TreeDecksLocator";
import { treeCardDescription } from "../material/TreeCardDescription";
import { fireStockLocator } from "./FireStockLocator";

class TreeDeckSpotLocator extends DeckLocator {
  getCoordinates(location: Location<number, number>): Partial<Coordinates> {
    return {
      x: fireStockLocator.coordinates.x + (location.id - 1) * treeCardDescription.width + (2 * location.id) + 1,
      y: treeDecksLocator.coordinates.y
    }
  }
}

export const treeDeckSpotLocator = new TreeDeckSpotLocator()