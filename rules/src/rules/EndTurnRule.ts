import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Clearing, clearingProperties } from '../material/Clearing'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Element, seasons } from '../Season'
import { ElementsHelper } from './helpers/ElementsHelper'
import { RuleId } from './RuleId'

export class EndTurnRule extends PlayerTurnRule {

  onRuleStart() {
    const moves: MaterialMove[] = []
    if (this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).getItems().length === 0) {
      // TODO: Is there a shuffle effect?
      const discardedDeck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDiscardPile)
      moves.push(discardedDeck.moveItemsAtOnce({type: LocationType.SharedDeck}))
      moves.push(discardedDeck.shuffle())
    }

    if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.nextPlayer).length > 0) {
      moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    } else if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.player).length > 0) {
      moves.push(this.startRule(RuleId.PlayerAction))
    } else {
      // Varan cards
      for (const season of seasons) {
        const waterValue = new ElementsHelper(this.game, this.player).getElementValue(Element.Water, season)
        if (this.fireValue > waterValue) {
          const varanDeck = this.material(MaterialType.AnimalCard).location(LocationType.VaranDeck).player(season).deck()
          moves.push(...varanDeck.deal({ type: LocationType.SharedDiscardPile }, this.spotsOnFire))
        }
      }

      // New fires
      const onibiPos = this.material(MaterialType.OnibiStandee).getItem()?.location.x
      for (let x of [onibiPos!-1, onibiPos!+1]) {
        if (x < -3 || x > 3) {
          x = x < -3 ? 3 : -3
        }
        if (this.material(MaterialType.FireToken).location(l => l.type === LocationType.ClearingCardSpot && l.x === x).getQuantity() === 0) {
          moves.push(this.material(MaterialType.FireToken).location(LocationType.FireStock).moveItem({type: LocationType.ClearingCardSpot, x}))
        }
      }

      // Recover action tokens
      for (const season of seasons) {
        const actionTokens = this.material(MaterialType.ActionToken).id(season).location(LocationType.ActionToken)
        if (actionTokens.getItems().length > 0) {
          moves.push(...actionTokens.moveItems({type: LocationType.PlayerActionSupply, player: season}))
        }
        // Move lost tokens to the supply
        const lostTokens = this.material(MaterialType.ActionToken).id(season).location(LocationType.PlayerActionLost)
        if (lostTokens.getItems().length > 0) {
          moves.push(...lostTokens.moveItems({type: LocationType.PlayerActionSupply, player: season}))
        }
      }

      // Send cards to the discard pile
      const cardsPlayed = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine || l.type === LocationType.PlayerHelpLine)
      moves.push(cardsPlayed.moveItemsAtOnce({type: LocationType.SharedDiscardPile}))

      // According to the rules: "On future turns, the first player to end the previous turn starts"
      moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    }

    return moves
  }

  get fireValue() {
    let value = 0
    const fireTokens = this.material(MaterialType.FireToken).location(LocationType.ClearingCardSpot)
    for (const element of fireTokens.getItems()) {
      value += clearingProperties[element.location.x! as Clearing]?.fireValue!
    }

    const onibi = this.material(MaterialType.OnibiStandee).getItem()
    if (!fireTokens.getItems().some(item => item.location.x === onibi?.location.x)) {
      value += clearingProperties[onibi?.location.x! as Clearing]?.fireValue!
    }

    return value
  }

  get spotsOnFire() {
    let value = 0
    const fireTokens = this.material(MaterialType.FireToken).location(LocationType.ClearingCardSpot)
    value = fireTokens.getQuantity()

    const onibi = this.material(MaterialType.OnibiStandee).getItem()
    if (!fireTokens.getItems().some(item => item.location.x === onibi?.location.x)) {
      value++
    }

    return value
  }

}