import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getOpponentSeason, Season } from '../Season'
import { SpiritType } from '../material/SpiritType'
import { Clearing, clearingProperties } from '../material/Clearing'

export class AdvancingOnibiRule extends PlayerTurnRule {
  elementValue = this.remind(Memory.RemainingElementValue)

  onRuleStart() {
    if (this.elementValue === 0) {
      return [this.startRule(RuleId.EndTurn)]
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const onibi = this.material(MaterialType.OnibiStandee)
    const minPos = -3
    const maxPos = 3
    // Starting in 1 to avoid remaining in the same position (the Monkey Opponent can do it)
    for (let x = 1; x <= this.elementValue; x++) {
      let xPos = onibi.getItem()?.location.x! + (this.player === Season.Summer ? x : -x) 
      // Update xPos for Round Robin
      // 7 is total cards in the clearing
      if (xPos < minPos) {
        xPos = maxPos - this.positiveModulo((minPos - xPos - 1), 7)
      } else if (xPos > maxPos) {
        xPos = minPos + this.positiveModulo((xPos - maxPos - 1), 7)
      }
      moves.push(onibi.moveItem({ type: LocationType.ClearingCardSpot, x: xPos }))
    }

    return moves
  }

  positiveModulo(n: number, m: number): number {
    return ((n % m) + m) % m
  }

  beforeItemMove(move: ItemMove<number, number, number>) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.OnibiStandee)(move)) {
      let win = false
      // TODO: Perform the full move step by step and not going directly to the position
      // TODO: Check if it's possible to get more than 7 winds. In that case we need to offer move 1 or move more.
      // TODO: Also check if it's possible to win going out the clearing two times (e.g. moving 8 being in the last card)
      if ((this.player === Season.Summer && move.location.x! <= this.material(MaterialType.OnibiStandee).getItem()?.location.x!)
        || (this.player === Season.Winter && move.location.x! >= this.material(MaterialType.OnibiStandee).getItem()?.location.x!) ) {
          const onibiCard = this.material(MaterialType.SpiritCard).id(SpiritType.Onibi)
          const onibiLocation = onibiCard.getItem()?.location
          if (onibiLocation?.type === LocationType.OnibiCard) {
            moves.push(onibiCard.moveItem({type: LocationType.PlayerSpiritLine, id: getOpponentSeason(this.player)}))
          } else if (onibiLocation?.type === LocationType.PlayerSpiritLine && onibiLocation?.id === this.player) {
            moves.push(onibiCard.moveItem({type: LocationType.OnibiCard}))            
          } else  if (onibiLocation?.type === LocationType.PlayerSpiritLine && onibiLocation?.id !== this.player) { // Winning condition
            win = true
          }
      }

      this.memorize(Memory.RemainingBonuses, [clearingProperties[move.location.x! as Clearing]?.bonus])
      moves.push(win ? this.startRule(RuleId.EndGame) : this.startRule(RuleId.OnibiBonusAction))
    }
    return moves
  }

}