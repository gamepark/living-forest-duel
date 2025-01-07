import { TokenDescription } from "@gamepark/react-game"
import Onibi from '../images/tokens/Onibi.png'
import { OnibiStandeeHelp } from './help/OnibiStandeeHelp'

class OnibiStandeeDescription extends TokenDescription {
  width = 3.9
  height = 5.6

  image = Onibi

  help = OnibiStandeeHelp
}

export const onibiStandeeDescription = new OnibiStandeeDescription()