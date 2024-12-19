import { PlayerTurnRule } from '@gamepark/rules-api'
import { Element } from '../Season'
import { Action, elementActionRule } from './actions/Action'
import { Memory } from './Memory'
import { PlayerTurnHelper } from './PlayerTurnHelper'

export abstract class ActionRule<T extends Action> extends PlayerTurnRule {
  get action(): T {
    const actions = this.remind<Action[]>(Memory.PendingActions)
    return actions[actions.length - 1] as T
  }

  get isBonusAction() {
    const action = this.action
    return action.element !== Element.Wind && action.bonus
  }

  endAction() {
    this.remind<Action[]>(Memory.PendingActions).pop()
    const nextAction = this.action
    if (nextAction) {
      return this.startRule(elementActionRule[nextAction.element])
    } else {
      return new PlayerTurnHelper(this.game).endCurrentPlayerTurn()
    }
  }
}
