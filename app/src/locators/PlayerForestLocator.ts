import { TreesHelper } from "@gamepark/living-forest-duel/rules/helpers/TreesHelper"
import { Season } from "@gamepark/living-forest-duel/Season"
import { DeckLocator, MaterialContext } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"
import { treeCardDescription } from "../material/TreeCardDescription"

class PlayerForestLocator extends DeckLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { xMax, xMin, yMax, yMin } = new TreesHelper(context.rules.game, location.player!).boundaries
    const { x, y } = { x: location.player === Season.Summer ? -48 : 48, y: -10 }
    const deltaX = (xMin + xMax) / 2
    const deltaY = (yMin + yMax) / 2
    
    return {
      x: x + (location.x! - deltaX) * (treeCardDescription.width + 0.2),
      y: y + (location.y! - deltaY) * (treeCardDescription.height + 0.2),
      z: (location.z ?? 0) * 0.05
    }
  }
}

export const playerForestLocator = new PlayerForestLocator()