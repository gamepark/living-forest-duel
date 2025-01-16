import { ListLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { actionTokenDescription } from '../material/ActionTokenDescription'
import { treeTokenLocator } from './TreeTokenLocator'

class PlayerActionSupplyLocator extends ListLocator {
  gap = { x: actionTokenDescription.width + 0.5 }
  
  getCoordinates(location: Location) {
    const { x, y } = treeTokenLocator.getCoordinates(location)
    return {
      x: x - 2,
      y: y + 5,
      z: 0.1
    }
  }
}

export const playerActionSupplyLocator = new PlayerActionSupplyLocator()