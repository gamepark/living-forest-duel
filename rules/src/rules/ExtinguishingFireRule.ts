import { CustomMove, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Element } from '../Season'
import { CustomMoveType } from './CustomMoveType'
import { ElementsHelper } from './helpers/ElementsHelper'
import { FireHelper } from './helpers/FireHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

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
    moves.push(...availableFireTokens.moveItems({type: LocationType.PlayerFireStock, player: this.player}))

    // const playerActionTokens = this.material(MaterialType.ActionToken).id(this.player).location(l => l.type === LocationType.ActionToken && l.y === Element.Water).getItems()
    // const lastActionToken = playerActionTokens.reduce((max, token) => token.location.x! > max.location.x! ? token : max, playerActionTokens[0])
    // Only can pass if at least one fire was taken
    // if (this.elementValue < new ElementsHelper(this.game, this.player).getElementValue(Element.Water, this.player, lastActionToken.location.x)) {
    const lastTokenX = !this.remind(Memory.BonusAction) ? this.material(MaterialType.ActionToken).location(l => l.type === LocationType.ActionToken && l.y === Element.Water).getItem()?.location.x : undefined
    if (this.elementValue < new ElementsHelper(this.game, this.player).getElementValue(Element.Water, this.player, lastTokenX)) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }

    return moves
  }

  getClearingCardValue(x: number) {
    return new FireHelper(this.game,this.player).getClearingCardValue(x)
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
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
      if (this.material(MaterialType.FireToken).location(l => l.type === LocationType.PlayerFireStock && l.player === this.player).getQuantity() === 8) {
        moves.push(this.endGame())
      } else {
        moves.push(this.startRule(RuleId.ExtinguishingFire))
      }
    }
    
    return moves
  }
}