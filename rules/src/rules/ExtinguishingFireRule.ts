import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'
import { Memory } from './Memory'
import { LocationType } from '../material/LocationType'

export class ExtinguishingFireRule extends PlayerTurnRule {
  elementValue = !this.remind(Memory.BonusAction) ? this.remind(Memory.RemainingElementValue) : this.remind(Memory.RemainingBonusElementValue)

  onRuleStart() {
    const totalAvailableFireTokens = this.material(MaterialType.FireToken).location(LocationType.ClearingCardSpot)
      .filter((token) => this.elementValue >= this.getClearingCardValue(token.location.x!)).getQuantity()

    if (totalAvailableFireTokens === 0) {
      if (!this.remind(Memory.BonusAction)) {
        return [this.startPlayerTurn(RuleId.PlayerAction,this.nextPlayer)]
      } else {
        return[this.startRule(RuleId.TreeBonusAction)]
      }
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const availableFireTokens = this.material(MaterialType.FireToken).location(LocationType.ClearingCardSpot)
      .filter((token) => this.elementValue >= this.getClearingCardValue(token.location.x!))    
    moves.push(...availableFireTokens.moveItems({type: LocationType.PlayerFireStock, id: this.player}))

    return moves
  }

  getClearingCardValue(x: number) {
    return x === 0 ? 2 : Math.abs(x) + 1
  }

  beforeItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.FireToken)(move)) {
      const x = Number(this.material(move.itemType).getItem(move.itemIndex).location.x)
      this.memorize(!this.remind(Memory.BonusAction) ? Memory.RemainingElementValue : Memory.RemainingBonusElementValue, this.elementValue - this.getClearingCardValue(x))
      // this.memorize(Memory.RemainingElementValue, )
    }
    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.FireToken)(move)) {
      // Check winning condition
      if (this.material(MaterialType.FireToken).location(l => l.type === LocationType.PlayerFireStock && l.id === this.player).getQuantity() === 8) {
        moves.push(this.startRule(RuleId.EndGame))
      } else {
        moves.push(this.startRule(RuleId.ExtinguishingFire))
      }
    }
    
    return moves
  }
}