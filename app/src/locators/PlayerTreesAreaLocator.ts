import { Season } from "@gamepark/living-forest-duel/Season"
import { Locator, MaterialContext } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"

class PlayerTreesAreaLocator extends Locator {
  getCoordinates(location: Location<number, number>, _context: MaterialContext<number, number, number>) {
    return {
      x: location.id === Season.Summer ? -15 : 15,
      y: 19
    }
  }
  // getCoordinates(location: Location) {
  //   // const deltaX = mainBoardDescription.height / 2 + projectCardDescription.height / 2 + 1
  //   return {
  //     x: location,
  //     y: 10
  //   }
  // }

}

export const playerTreesAreaLocator = new PlayerTreesAreaLocator()