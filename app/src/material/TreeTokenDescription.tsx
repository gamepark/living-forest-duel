import { getPlayerName } from '@gamepark/living-forest-duel/LivingForestDuelOptions'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { Season, seasons } from '@gamepark/living-forest-duel/Season'
import { FlatMaterialDescription, MaterialHelpProps } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'
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

  help = TreeTokenHelp
}

const TreeTokenHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  return <h2>{getPlayerName(item.id, t)}</h2>
}

export const treeTokenDescription = new TreeTokenDescription()