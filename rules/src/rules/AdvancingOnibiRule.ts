import { CustomMove, isMoveItemType, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { range } from 'lodash'
import { Clearing, clearingProperties } from '../material/Clearing'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { getOpponentSeason, Season } from '../Season'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class AdvancingOnibiRule extends PlayerTurnRule {
  get elementValue() {
    return this.remind(Memory.RemainingElementValue)
  }

  getPlayerMoves() {
    return range(1, this.elementValue + 1).map(distance => this.customMove(CustomMoveType.MoveOnibi, distance))
  }

  onCustomMove(move: CustomMove) {
    if (move.type !== CustomMoveType.MoveOnibi) return []
    this.memorize(Memory.RemainingElementValue, move.data)
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
    const onibiCardOwner = onibiCard.getItem()!.location.id
    if (onibiCardOwner === this.player) {
      return onibiCard.moveItem({ type: LocationType.OnibiCard })
    } else if (onibiCardOwner === undefined) {
      return onibiCard.moveItem({ type: LocationType.PlayerSpiritLine, id: getOpponentSeason(this.player) })
    } else {
      return this.endGame()
    }
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.OnibiStandee)(move)) return []
    this.memorize<number>(Memory.RemainingElementValue, value => value - 1)
    if (this.elementValue > 0) {
      return [this.moveOnibiOnce()]
    } else {
      this.memorize(Memory.RemainingBonuses, [clearingProperties[move.location.x! as Clearing]?.bonus])
      return [this.startRule(RuleId.OnibiBonusAction)]
    }
  }

}