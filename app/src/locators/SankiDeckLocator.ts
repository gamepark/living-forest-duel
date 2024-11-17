import { ListLocator } from "@gamepark/react-game";
import { onibiCardLocator } from "./OnibiCardLocator";
import { spiritCardDescription } from "../material/SpiritCardDescription";

class SankiDeckLocator extends ListLocator {
  coordinates = { x: onibiCardLocator.coordinates.x + spiritCardDescription.width + 1.5, y: onibiCardLocator.coordinates.y}
}

export const sankiDeckLocator = new SankiDeckLocator()