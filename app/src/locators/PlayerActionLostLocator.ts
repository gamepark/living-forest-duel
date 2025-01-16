import { ListLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { actionTokenDescription } from '../material/ActionTokenDescription'
import { playerActionSupplyLocator } from './PlayerActionSupplyLocator'

class PlayerActionLostLocator extends ListLocator {
  gap = { x: actionTokenDescription.width + 0.5 }

  getCoordinates(location: Location) {
    const { x, y } = playerActionSupplyLocator.getCoordinates(location)
    return { x, y: y + 2.5 }
  }
}

export const playerActionLostLocator = new PlayerActionLostLocator()