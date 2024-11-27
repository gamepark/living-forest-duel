import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { RuleId } from './RuleId'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Element, seasons } from '../Season'
import { Clearing, clearingProperties } from '../material/Clearing'
import { ElementsHelper } from './helpers/ElementsHelper'

export class EndTurnRule extends PlayerTurnRule {

  onRuleStart() {
    const moves: MaterialMove[] = []

    // Shuffle discard pile if necessary
    if (this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).getQuantity() === 0) {
      const discardedDeck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDiscardPile).deck()
      // TODO: Is there a shuffle effect?
      discardedDeck.shuffle()
      moves.push(discardedDeck.moveItemsAtOnce({type: LocationType.SharedDeck}))
    }

    if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).getQuantity() > 0) {
      moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    } else {
      // Varan cards
      for (const season of seasons) {
        const waterValue = new ElementsHelper(this.game, this.player).getElementValue(Element.Water, season)
        if (this.fireValue > waterValue) {
          const varanDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.VaranDeck && l.id === season)
          for (let i=0; i < this.spotsOnFire; i++) {
            moves.push(varanDeck.moveItem({type: LocationType.SharedDiscardPile}))
          }
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
        if (actionTokens.getQuantity() > 0) {
          moves.push(actionTokens.moveItemsAtOnce({type: LocationType.PlayerActionSupply, id: season}))
        }
        // Recreate removed tokens
        // TODO: Think if tokens should not be removed but just hidden. In any case, they need to appear again here
        for (let y = actionTokens.getQuantity(); y < 2; y++) {
          moves.push(this.material(MaterialType.ActionToken).createItem({
            id: season,
            location: {
              type: LocationType.PlayerActionSupply,
              id: season,
              y
            }
          }))
        }
      }
      
      // Send cards to the discard pile
      const cardsPlayed = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine || l.type === LocationType.PlayerHelpLine)
      moves.push(cardsPlayed.moveItemsAtOnce({type: LocationType.SharedDiscardPile}))

      // According to the rules: "On future turns, the first player to end the previous turn starts"
      moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.player))
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