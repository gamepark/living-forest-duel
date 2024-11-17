import { Season } from "@gamepark/living-forest-duel/Season"
import { Locator, MaterialContext } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"

class PlayerTreesAreaLocator extends Locator {
  getCoordinates(location: Location<number, number>, _context: MaterialContext<number, number, number>) {
    return {
      x: location.id === Season.Summer ? -46 : 46,
      y: -10
    }
  }
}

export const playerTreesAreaLocator = new PlayerTreesAreaLocator()