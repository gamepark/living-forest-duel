import { Season } from "@gamepark/living-forest-duel/Season"
import { ListLocator, MaterialContext } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"
import { actionTokenDescription } from "../material/ActionTokenDescription"
import { sharedHelpLineLocator } from "./SharedHelpLineLocator"

class PlayerActionSupplyLocator extends ListLocator {
  gap = { y: actionTokenDescription.height + 0.5 }
  
  getCoordinates(location: Location<number, number>, _context: MaterialContext<number, number, number>) {
    return {
      x: location.id === Season.Summer ? -37 : 37,
      y: sharedHelpLineLocator.coordinates.y
    }
  }
}

export const playerActionSupplyLocator = new PlayerActionSupplyLocator()