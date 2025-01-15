import { MaterialContext, TokenDescription } from "@gamepark/react-game"
import { Season } from "@gamepark/living-forest-duel/Season"
import SummerArrow from '../images/tokens/SummerArrow.png'
import WinterArrow from '../images/tokens/WinterArrow.png'
import SummerArrowLost from '../images/tokens/SummerArrowLost.png'
import WinterArrowLost from '../images/tokens/WinterArrowLost.png'
import { LocationType } from "@gamepark/living-forest-duel/material/LocationType"
import { MaterialItem } from "@gamepark/rules-api"
import { ActionTokenHelp } from './help/ActionTokenHelp'

class ActionTokenDescription extends TokenDescription {
  width = 2.7
  height = 2.3
  borderRadius = 0.5

  images = {
    [Season.Summer]: SummerArrow,
    [Season.Winter]: WinterArrow
  }

  backImages = {
    [Season.Summer]: SummerArrowLost,
    [Season.Winter]: WinterArrowLost,
  }

  help = ActionTokenHelp

  isFlippedOnTable(item: Partial<MaterialItem>, context: MaterialContext) {
    return item.location?.type === LocationType.PlayerActionLost || super.isFlippedOnTable(item, context)
  }
}

export const actionTokenDescription = new ActionTokenDescription()