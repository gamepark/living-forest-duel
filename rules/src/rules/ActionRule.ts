import { PlayerTurnRule } from '@gamepark/rules-api'
import { Action, elementActionRule } from './actions/Action'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export abstract class ActionRule extends PlayerTurnRule {
  get action() {
    const actions = this.remind<Action[]>(Memory.PendingActions)
    return actions[actions.length - 1]
  }

  endAction() {
    this.remind<Action[]>(Memory.PendingActions).pop()
    const nextAction = this.action
    if (nextAction) {
      return this.startRule(elementActionRule[nextAction.element])
    } else {
      return this.startRule(RuleId.EndPlayerTurn)
    }
  }
}
