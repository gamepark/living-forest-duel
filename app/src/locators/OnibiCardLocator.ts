import { Locator } from "@gamepark/react-game";
import { spiritCardDescription } from "../material/SpiritCardDescription";
import { varanDecksLocator } from "./VaranDecksLocator";
import { LocationType } from "@gamepark/living-forest-duel/material/LocationType";
import { Season } from "@gamepark/living-forest-duel/Season";
import { fireStockLocator } from "./FireStockLocator";

class OnibiCardLocator extends Locator {
  gap = { x: spiritCardDescription.width + 1 }
  coordinates = { x: varanDecksLocator.getCoordinates({type: LocationType.OnibiCard, id: Season.Winter}).x - 0.5, y: fireStockLocator.coordinates.y!}
}

export const onibiCardLocator = new OnibiCardLocator()