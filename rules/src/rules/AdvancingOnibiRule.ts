import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Season } from '../Season'
import { SpiritType } from '../material/SpiritType'
// import { Season } from '../Season'

export class AdvancingOnibiRule extends PlayerTurnRule {
  elementValue = this.remind(Memory.RemainingElementValue)

  onRuleStart() {
    if (this.elementValue === 0) {
      return [this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer)]
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const onibi = this.material(MaterialType.OnibiStandee)
    const minPos = -3
    const maxPos = 3
    for (let x = 0; x <= this.elementValue; x++) {
      let xPos = onibi.getItem()?.location.x! + (this.player === Season.Summer ? x : -x) 
      // Update xPos for Round Robin
      // 7 is total cards in the clearing
      if (xPos < minPos) {
        xPos = maxPos - ((minPos - xPos -1) % 7)
      } else if (xPos > maxPos) {
        xPos = minPos + ((x - maxPos -1) % 7)
      }
      moves.push(onibi.moveItem({ type: LocationType.ClearingCardSpot, x: xPos }))
    }

    return moves
  }

  beforeItemMove(move: ItemMove<number, number, number>) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.OnibiStandee)(move)) {
      if ((this.player === Season.Summer && move.location.x! <= this.material(MaterialType.OnibiStandee).getItem()?.location.x!)
        || (this.player === Season.Winter && move.location.x! >= this.material(MaterialType.OnibiStandee).getItem()?.location.x!) ) {
          const onibiCard = this.material(MaterialType.SpiritCard).id(SpiritType.Onibi)
          const onibiLocation = onibiCard.getItem()?.location
          if (onibiLocation?.type === LocationType.OnibiCard) {
            moves.push(onibiCard.moveItem({type: LocationType.PlayerSpiritLine, id: this.player === Season.Summer ? Season.Winter : Season.Summer}))
          } else if (onibiLocation?.type === LocationType.PlayerSpiritLine && onibiLocation?.id === this.player) {
            moves.push(onibiCard.moveItem({type: LocationType.OnibiCard}))
          } else  if (onibiLocation?.type === LocationType.PlayerSpiritLine && onibiLocation?.id !== this.player) {
            // Winning condition
            moves.push(this.startRule(RuleId.EndGame))
          }
      }
    }
    return moves
  }

}