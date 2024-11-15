import { TokenDescription } from "@gamepark/react-game"
import Fire from '../images/tokens/Fire.png'

class FireTokenDescription extends TokenDescription {
  width = 2
  height = 2.6

  image = Fire
}

export const fireTokenDescription = new FireTokenDescription()