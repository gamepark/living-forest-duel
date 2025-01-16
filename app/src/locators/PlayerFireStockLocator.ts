import { PileLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { sharedHelpLineLocator } from './SharedHelpLineLocator'
import { treeTokenLocator } from './TreeTokenLocator'

class PlayerFireStockLocator extends PileLocator {
  radius = 1.5

  getCoordinates(location: Location) {
    return {
      x: treeTokenLocator.getCoordinates(location).x,
      y: sharedHelpLineLocator.coordinates.y + 22
    }
  }

}

export const playerFireStockLocator = new PlayerFireStockLocator()