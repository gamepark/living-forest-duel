import { PlayerTurnRule } from '@gamepark/rules-api'
import { Element } from '../Season'
import { Action, elementActionRule } from './actions/Action'
import { ElementsHelper } from './helpers/ElementsHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export abstract class ActionRule extends PlayerTurnRule {
  canPass() {
    const { bonus, value } = this.action
    return bonus || value < new ElementsHelper(this.game).getElementValue(Element.Plant)
  }

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
