import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { CustomMoveType } from '@gamepark/living-forest-duel/rules/CustomMoveType'
import { Season } from '@gamepark/living-forest-duel/Season'
import { DropAreaDescription, Locator, MaterialContext } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, Location, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { maxBy } from 'lodash'
import { clearingCardDescription, positiveModulo } from '../material/ClearingCardDescription'

class ClearingCardSpotLocator extends Locator {
  parentItemType = MaterialType.ClearingCard

  getParentItem(location: Location) {
    return clearingCardDescription.staticItems.find(item => item.location.x === location.x)
  }

  getItemCoordinates(item: MaterialItem) {
    if (item.id === MaterialType.FireToken) {
      return { x: 1.5 }
    } else {
      return { x: -2, y: -1 }
    }
  }

  locationDescription = new ClearingCardSpotDescription(clearingCardDescription)
}

class ClearingCardSpotDescription extends DropAreaDescription {
  canLongClick() {
    return false
  }

  isMoveToLocation(move: MaterialMove, location: Location, context: MaterialContext) {
    return this.canDrop(move, location, context)
  }

  canDrop(move: MaterialMove, location: Location, { player, rules }: MaterialContext) {
    if (!isCustomMoveType(CustomMoveType.MoveOnibi)(move)) return false
    const onibiX = rules.material(MaterialType.OnibiStandee).getItem()!.location.x!
    const clearingX = location.x!
    const cardDistance = positiveModulo(player === Season.Summer ? clearingX - onibiX : onibiX - clearingX, 7)
    return positiveModulo(move.data, 7) === cardDistance
  }

  getBestDropMove(moves: MaterialMove[]) {
    return maxBy(moves, move => (move as CustomMove).data)!
  }
}

export const clearingCardSpotLocator = new ClearingCardSpotLocator()