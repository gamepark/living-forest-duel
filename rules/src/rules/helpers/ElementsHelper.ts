import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { Animal, animalProperties } from '../../material/Animal'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { getTreeElement, Tree } from '../../material/Tree'
import { Element, Season } from '../../Season'
import { Memory } from '../Memory'

export class ElementsHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player: Season = game.rule!.player!) {
    super(game)
  }

  setRemainingElementValue(elementType: Element) {
    const action: ActionType = { element: elementType, remainingElementValue: this.getElementValue(elementType) }
    this.memorize(Memory.CurrentAction, action)
  }

  getRemainingElementValue() {
    return this.remind(Memory.RemainingBonuses).length === 0 ? this.remind(Memory.CurrentAction).remainingElementValue : this.getRemainingBonusElementValue()
  }

  setRemainingBonusElementValue(elementType: Element) {
    this.updateRemainingElementValue(this.getElementValue(elementType))
  }

  getRemainingBonusElementValue() {
    const bonus: ActionType = this.remind(Memory.RemainingBonuses).slice(-1)[0]
    if (bonus !== undefined) {
      return bonus.remainingElementValue
    } else {
      return 0
    }
  }

  updateRemainingElementValue(newValue: number) {
    if (!this.isBonusAction()) {
      const currentAction = this.remind(Memory.CurrentAction)
      currentAction.remainingElementValue = newValue
      this.memorize(Memory.CurrentAction, currentAction)
    } else {
      const bonuses: ActionType[] = this.remind(Memory.RemainingBonuses)
      bonuses[bonuses.length - 1].remainingElementValue = newValue
      this.memorize(Memory.RemainingBonuses, bonuses)
    }
  }

  removeLastBonusElement() {
    const remainingBonuses = this.remind(Memory.RemainingBonuses)
    remainingBonuses.pop()
    this.memorize(Memory.RemainingBonuses, remainingBonuses)

    return remainingBonuses
  }

  isBonusAction() {
    return this.remind(Memory.RemainingBonuses).length > 0
  }

  getElementValue(element: Element, ignoreLastToken = false) {
    return this.getSharedElementValue(element, ignoreLastToken)
      + this.getPlayerLineElementValue(element)
      + this.getPlayerForestElementValue(element)
  }

  getTokenX(token: MaterialItem) {
    return this.material(MaterialType.AnimalCard).getItem(token.location.parent!).location.x!
  }

  getSharedElementValue(element: Element, ignoreLastToken = false) {
    const tokensX = this.material(MaterialType.ActionToken).location(LocationType.PointElement).locationId(element).getItems()
      .map(token => this.getTokenX(token))
    if (ignoreLastToken) tokensX.splice(tokensX.indexOf(Math.max(...tokensX)), 1)
    const maxTokenX = Math.max(...tokensX)
    const cards = this.material(MaterialType.AnimalCard).location(LocationType.SharedHelpLine).location(l => l.x! > maxTokenX).getItems<Animal>()
    return sumBy(cards, card => animalProperties[card.id].elements[element] ?? 0)
  }

  getPlayerLineElementValue(element: Element) {
    const cards = this.material(MaterialType.AnimalCard).location(LocationType.PlayerHelpLine).player(this.player).getItems<Animal>()
    return sumBy(cards, card => animalProperties[card.id].elements[element] ?? 0)
  }

  getPlayerForestElementValue(element: Element) {
    return this.material(MaterialType.TreeCard)
      .location(LocationType.PlayerForest)
      .player(this.player)
      .id<Tree>(tree => getTreeElement(tree) === element)
      .length
  }
}

export type ActionType = {
  element: Element,
  remainingElementValue: number
}