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

    if (this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).getItems().length === 0) {
      // TODO: Is there a shuffle effect?
      const discardedDeck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDiscardPile)
      moves.push(discardedDeck.moveItemsAtOnce({type: LocationType.SharedDeck}))
      moves.push(discardedDeck.shuffle())
    }

    if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).getItems().length > 0) {
      moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    } else {
      // Varan cards
      for (const season of seasons) {
        const waterValue = new ElementsHelper(this.game, this.player).getElementValue(Element.Water, season)
        if (this.fireValue > waterValue) {
          const varanDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.VaranDeck && l.id === season)
          for (let i=0; i < this.spotsOnFire; i++) {
            if (varanDeck.getQuantity() > 0) {
              moves.push(varanDeck.moveItem({type: LocationType.SharedDiscardPile}))
            } else {
              break
            }
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
        // const actionTokens = this.material(MaterialType.ActionToken).id(season)
        // moves.push(...actionTokens.moveItems({type: LocationType.PlayerActionSupply, id: season}))
        const actionTokens = this.material(MaterialType.ActionToken).id(season).location(LocationType.ActionToken)
        if (actionTokens.getItems().length > 0) {
          moves.push(...actionTokens.moveItems({type: LocationType.PlayerActionSupply, id: season}))
        }
        // Move lost tokens to the supply
        const lostTokens = this.material(MaterialType.ActionToken).id(season).location(LocationType.PlayerActionLost)
        if (lostTokens.getItems().length > 0) {
          moves.push(...lostTokens.moveItems({type: LocationType.PlayerActionSupply, id: season}))
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

  // afterItemMove(move: ItemMove) {
  //   if (isMoveItemsAtOnce(move) && move.itemType === MaterialType.AnimalCard && move.location.type === LocationType.SharedDeck) {
  //     const deck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck)
  //     return [deck.shuffle()]
  //   } 
  //   return []
  // }

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