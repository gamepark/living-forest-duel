import { TreesHelper } from "@gamepark/living-forest-duel/rules/helpers/TreesHelper"
import { Season } from "@gamepark/living-forest-duel/Season"
import { DeckLocator, MaterialContext } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"
import { treeCardDescription } from "../material/TreeCardDescription"

class PlayerForestLocator extends DeckLocator {
  gapX = treeCardDescription.width + 0.2
  gapY = treeCardDescription.height + 0.2

  getCoordinates(location: Location, context: MaterialContext) {
    const { xMax, xMin, yMax, yMin } = new TreesHelper(context.rules.game, location.player!).boundaries
    const baseX = 52 + Math.max(xMax - xMin - 2, 0) * this.gapX / 2
    const x = location.player === Season.Summer ? -baseX : baseX
    const deltaX = (xMin + xMax) / 2
    const deltaY = (yMin + yMax) / 2
    
    return {
      x: x + (location.x! - deltaX) * this.gapX,
      y: -12 + (location.y! - deltaY) * this.gapY,
      z: (location.z ?? 0) * 0.05
    }
  }
}

export const playerForestLocator = new PlayerForestLocator()