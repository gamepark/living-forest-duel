import { CustomMove, isMoveItemType, ItemMove } from '@gamepark/rules-api'
import { range } from 'lodash'
import { Clearing, clearingProperties } from '../material/Clearing'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { Element, getOpponentSeason, Season } from '../Season'
import { ActionRule } from './ActionRule'
import { Action, AdvancingOnibi, elementActionRule } from './actions/Action'
import { CustomMoveType } from './CustomMoveType'
import { ElementsHelper } from './helpers/ElementsHelper'
import { SankiHelper } from './helpers/SankiHelper'
import { Memory } from './Memory'

export class AdvancingOnibiRule extends ActionRule<AdvancingOnibi> {
  getPlayerMoves() {
    return range(1, this.action.value + 1).map(distance => this.customMove(CustomMoveType.MoveOnibi, distance))
  }

  onCustomMove(move: CustomMove) {
    if (move.type !== CustomMoveType.MoveOnibi) return []
    this.action.value = move.data
    return [this.moveOnibiOnce()]
  }

  moveOnibiOnce() {
    const onibi = this.material(MaterialType.OnibiStandee)
    const onibiX = onibi.getItem()!.location.x!
    const nextX = this.player === Season.Summer ? onibiX + 1 : onibiX - 1
    if (Math.abs(nextX) <= 3) {
      return onibi.moveItem({ type: LocationType.ClearingCardSpot, x: nextX })
    } else {
      return onibi.moveItem({ type: LocationType.ClearingCardSpot, x: nextX === -4 ? 3 : -3 })
    }
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.OnibiStandee)(move)) return []
    const onibi = this.material(MaterialType.OnibiStandee)
    const onibiX = onibi.getItem()!.location.x!
    if (Math.abs(onibiX - move.location.x!) > 1) {
      return [this.moveOnibiCard()]
    }
    return []
  }

  moveOnibiCard() {
    const onibiCard = this.material(MaterialType.SpiritCard).id(SpiritType.Onibi)
    const onibiCardOwner = onibiCard.getItem()!.location.player
    if (onibiCardOwner === this.player) {
      return onibiCard.moveItem({ type: LocationType.OnibiCard })
    } else if (onibiCardOwner === undefined) {
      return onibiCard.moveItem({ type: LocationType.PlayerSpiritLine, player: getOpponentSeason(this.player) })
    } else {
      return this.endGame()
    }
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.OnibiStandee)(move)) return []

    if (--this.action.value > 0) {
      return [this.moveOnibiOnce()]
    }

    const bonus = clearingProperties[move.location.x! as Clearing]!.bonus!
    if (bonus === Element.Wind) {
      return new SankiHelper(this.game).takeSankiCards().concat(this.endAction())
    } else {
      const actions = this.remind<Action[]>(Memory.PendingActions)
      actions.pop()
      const value = new ElementsHelper(this.game).getElementValue(bonus)
      const action: Action = bonus === Element.Plant ?
        { element: bonus, value, plantedTreesElements: [], bonus: true }
        : { element: bonus, value, bonus: true }
      actions.push(action)
      return [this.startRule(elementActionRule[bonus])]
    }
  }

}