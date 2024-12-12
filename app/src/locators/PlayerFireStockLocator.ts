import { PileLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { treeTokenDescription } from '../material/TreeTokenDescription'
import { sharedHelpLineLocator } from './SharedHelpLineLocator'
import { treeTokenLocator } from './TreeTokenLocator'

class PlayerFireStockLocator extends PileLocator {
  radius = 1.5

  getCoordinates(location: Location) {
    return {
      x: treeTokenLocator.getCoordinates(location).x,
      y: sharedHelpLineLocator.coordinates.y + treeTokenDescription.height * 2
    }
  }

}

export const playerFireStockLocator = new PlayerFireStockLocator()