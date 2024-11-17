import { FlatMaterialDescription } from "@gamepark/react-game";
import { LocationType } from "@gamepark/living-forest-duel/material/LocationType";
import { Season, seasons } from "@gamepark/living-forest-duel/Season";
import SummerTreeToken from '../images/summer.png'
import WinterTreeToken from '../images/winter.png'


class TreeTokenDescription extends FlatMaterialDescription {
  width = 6.3
  height = 8.8

  images = {
    [Season.Summer]: SummerTreeToken,
    [Season.Winter]: WinterTreeToken
  }

  staticItems = seasons.map(x => ({
    id: x,
    location: {
      type: LocationType.TreeToken,
      id: x
    }
  }))
}

export const treeTokenDescription = new TreeTokenDescription()