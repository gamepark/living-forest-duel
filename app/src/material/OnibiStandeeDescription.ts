import { CustomMoveType } from '@gamepark/living-forest-duel/rules/CustomMoveType'
import { TokenDescription } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import Onibi from '../images/tokens/Onibi.png'
import { OnibiStandeeHelp } from './help/OnibiStandeeHelp'

class OnibiStandeeDescription extends TokenDescription {
  width = 3.9
  height = 5.6

  image = Onibi

  help = OnibiStandeeHelp

  canDrag(move: MaterialMove) {
    return isCustomMoveType(CustomMoveType.MoveOnibi)(move)
  }
}

export const onibiStandeeDescription = new OnibiStandeeDescription()