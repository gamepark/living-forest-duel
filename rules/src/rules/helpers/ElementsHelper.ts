import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { Animal, animalProperties } from '../../material/Animal'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { getTreeElement, Tree } from '../../material/Tree'
import { Element, Season } from '../../Season'

export class ElementsHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player: Season = game.rule!.player!) {
    super(game)
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
