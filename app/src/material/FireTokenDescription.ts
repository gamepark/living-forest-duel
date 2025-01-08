import { TokenDescription } from "@gamepark/react-game"
import Fire from '../images/tokens/Fire.png'
import { FireTokenHelp } from './help/FireTokenHelp'

class FireTokenDescription extends TokenDescription {
  width = 2
  height = 2.6

  image = Fire

  help = FireTokenHelp
}

export const fireTokenDescription = new FireTokenDescription()