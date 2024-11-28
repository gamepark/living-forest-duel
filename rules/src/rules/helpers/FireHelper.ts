import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class FireHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
  }

  getAvailableFireTokens(waterValue: number) {
    return this.material(MaterialType.FireToken).location(LocationType.ClearingCardSpot).filter((token) => waterValue >= this.getClearingCardValue(token.location.x!))
  }

  canFireBeExtinguished(waterValue: number) {
    return this.getAvailableFireTokens(waterValue).getItems().length > 0
  }

  getClearingCardValue(x: number) {
    return x === 0 ? 2 : Math.abs(x) + 1
  }

}