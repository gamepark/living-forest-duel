import { FlatMaterialDescription } from "@gamepark/react-game";
import { LocationType } from "@gamepark/living-forest-duel/material/LocationType";
import { Season, seasons } from "@gamepark/living-forest-duel/Season";
import SummerTreeToken from '../images/summer.png'
import WinterTreeToken from '../images/winter.png'


class TreeTokenDescription extends FlatMaterialDescription {
  width = 9
  height = 9

  images = {
    [Season.Summer]: SummerTreeToken,
    [Season.Winter]: WinterTreeToken
  }

  staticItems = seasons.map(season => ({
    id: season,
    location: {
      type: LocationType.TreeToken,
      player: season
    }
  }))
}

export const treeTokenDescription = new TreeTokenDescription()