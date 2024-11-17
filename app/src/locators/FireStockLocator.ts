import { PileLocator } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'

class FireStockLocator extends PileLocator {
  coordinates = { x: -30, y: -25 }
  radius = 3

  getPileId(item: MaterialItem) {
    return item.id
  }
}

export const fireStockLocator = new FireStockLocator()