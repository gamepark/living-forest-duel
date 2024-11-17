import { ListLocator } from "@gamepark/react-game";
import { treeCardDescription } from "../material/TreeCardDescription";
import { clearingLineLocator } from "./ClearingLineLocator";

class TreeDecksLocator extends ListLocator {
  gap = { x: treeCardDescription.width + 1 }
  coordinates = { x: -28, y: clearingLineLocator.coordinates.y - 10}
}

export const treeDecksLocator = new TreeDecksLocator()