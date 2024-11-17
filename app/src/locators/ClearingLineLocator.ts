import { ListLocator } from "@gamepark/react-game";
import { clearingCardDescription } from "../material/ClearingCardDescription";

class ClearingLineLocator extends ListLocator {
  gap = { x: clearingCardDescription.width + 1 }
  coordinates = { y: -15 }
}

export const clearingLineLocator = new ClearingLineLocator()