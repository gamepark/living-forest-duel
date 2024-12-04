import { DeckLocator } from "@gamepark/react-game";
import { varanDecksLocator } from "./VaranDecksLocator";
import { LocationType } from "@gamepark/living-forest-duel/material/LocationType";
import { Season } from "@gamepark/living-forest-duel/Season";
import { fireStockLocator } from "./FireStockLocator";

class SankiDeckLocator extends DeckLocator {
  coordinates = { x: varanDecksLocator.getCoordinates({type: LocationType.OnibiCard, id: Season.Winter}).x - 0.5, y: fireStockLocator.coordinates.y!}
}

export const sankiDeckLocator = new SankiDeckLocator()