import { CardDescription } from "@gamepark/react-game"
import { SpiritType } from '@gamepark/living-forest-duel/material/SpiritType'
import Onibi from '../images/cards/Onibi.jpg'
import Sanki from '../images/cards/Sanki.jpg'
import { SpiritCardHelp } from './help/SpiritCardHelp'

class SpiritCardDescription extends CardDescription {
  width = 6.3
  height = 8.8
  borderRadius = 0.5

  images = {
    [SpiritType.Onibi]: Onibi,
    [SpiritType.Sanki]: Sanki
  }

  help = SpiritCardHelp
}

export const spiritCardDescription = new SpiritCardDescription()