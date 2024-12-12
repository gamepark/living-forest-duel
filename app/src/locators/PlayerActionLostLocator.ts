import { ListLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { actionTokenDescription } from '../material/ActionTokenDescription'
import { treeTokenDescription } from '../material/TreeTokenDescription'
import { treeTokenLocator } from './TreeTokenLocator'

class PlayerActionLostLocator extends ListLocator {
  gap = { x: actionTokenDescription.width + 0.5 }

  getCoordinates(location: Location) {
    const { x, y } = treeTokenLocator.getCoordinates(location)
    return {
      x: x - treeTokenDescription.width / 2,
      y: y + treeTokenDescription.height / 2
    }
  }
}

export const playerActionLostLocator = new PlayerActionLostLocator()