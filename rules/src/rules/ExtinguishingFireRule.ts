import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'
import { Memory } from './Memory'
import { LocationType } from '../material/LocationType'
import { Element } from '../Season'
import { FireHelper } from './helpers/FireHelper'
import { ElementsHelper } from './helpers/ElementsHelper'
import { CustomMoveType } from './CustomMoveType'

export class ExtinguishingFireRule extends PlayerTurnRule {
  elementValue = !this.remind(Memory.BonusAction) ? this.remind(Memory.RemainingElementValue) : this.remind(Memory.RemainingBonusElementValue)

  onRuleStart() {
    if (!new FireHelper(this.game,this.player).canFireBeExtinguished(this.elementValue)) {
      if (!this.remind(Memory.BonusAction)) {
        return [this.startRule(RuleId.EndTurn)]
      } else {
        return[this.startRule(this.remind(Memory.BonusAction) === Element.Plant ? RuleId.TreeBonusAction : RuleId.OnibiBonusAction)]
      }
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const availableFireTokens = new FireHelper(this.game,this.player).getAvailableFireTokens(this.elementValue)
    moves.push(...availableFireTokens.moveItems({type: LocationType.PlayerFireStock, id: this.player}))

    // Only can pass if at least one fire was taken
    const playerActionTokens = this.material(MaterialType.ActionToken).id(this.player).location(l => l.type === LocationType.ActionToken && l.y === Element.Water).getItems()
    const lastActionToken = playerActionTokens.reduce((max, token) => token.location.x! > max.location.x! ? token : max, playerActionTokens[0])
    if (this.elementValue < new ElementsHelper(this.game, this.player).getElementValue(Element.Water, this.player, lastActionToken.location.x)) {
      moves.push(this.customMove(CustomMoveType.ActionPass))
    }

    return moves
  }

  getClearingCardValue(x: number) {
    return new FireHelper(this.game,this.player).getClearingCardValue(x)
  }

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.ActionPass)(move)) {
      if (!this.remind(Memory.BonusAction)) {
        return [this.startRule(RuleId.EndTurn)]
      } else {
        return[this.startRule(this.remind(Memory.BonusAction) === Element.Plant ? RuleId.TreeBonusAction : RuleId.OnibiBonusAction)]
      }
    }
    return []
  }

  beforeItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.FireToken)(move)) {
      const x = Number(this.material(move.itemType).getItem(move.itemIndex).location.x)
      this.memorize(!this.remind(Memory.BonusAction) ? Memory.RemainingElementValue : Memory.RemainingBonusElementValue, this.elementValue - this.getClearingCardValue(x))
    }
    return []
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