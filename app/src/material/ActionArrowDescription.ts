import { TokenDescription } from "@gamepark/react-game"
import { Season } from "@gamepark/living-forest-duel/Season"
import SummerArrow from '../images/tokens/SummerArrow.png'
import WinterArrow from '../images/tokens/WinterArrow.png'

class ActionArrowDescription extends TokenDescription {
  width = 2.3
  height = 2.7

  images = {
    [Season.Summer]: SummerArrow,
    [Season.Winter]: WinterArrow
  }
}

export const actionArrowDescription = new ActionArrowDescription()