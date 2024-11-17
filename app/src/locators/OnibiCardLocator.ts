import { ListLocator } from "@gamepark/react-game";
import { treeDecksLocator } from "./TreeDecksLocator";
import { spiritCardDescription } from "../material/SpiritCardDescription";
import { treeCardDescription } from "../material/TreeCardDescription";

class OnibiCardLocator extends ListLocator {
  gap = { x: spiritCardDescription.width + 1 }
  coordinates = { x: treeDecksLocator.coordinates.x + treeCardDescription.width * 5 + 5.75, y: treeDecksLocator.coordinates.y + 0.5}
}

export const onibiCardLocator = new OnibiCardLocator()