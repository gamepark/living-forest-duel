import { Locator } from "@gamepark/react-game";
import { spiritCardDescription } from "../material/SpiritCardDescription";
import { sankiDeckLocator } from "./SankiDeckLocator";

class OnibiCardLocator extends Locator {
  gap = { x: spiritCardDescription.width + 1 }
  coordinates = { x: sankiDeckLocator.coordinates.x - spiritCardDescription.width - 1.5, y: sankiDeckLocator.coordinates.y}
}

export const onibiCardLocator = new OnibiCardLocator()