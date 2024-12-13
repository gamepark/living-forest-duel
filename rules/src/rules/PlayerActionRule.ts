import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Animal, animalProperties, AnimalType, getAnimalSeason, isVaran } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { Season, seasons } from '../Season'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { Memory } from './Memory'
import { PlayerUseActionTokenRule } from './PlayerUseActionTokenRule'
import { RuleId } from './RuleId'

// export class PlayerActionRule extends PlayerTurnRule {
export class PlayerActionRule extends PlayerUseActionTokenRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = []
    
    // Add one card to the shared help line
    const sharedDeck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).deck()
    moves.push(sharedDeck.dealOne({ type: LocationType.SharedHelpLine }))
    moves.push(...super.getPlayerMoves())

    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.AnimalCard)(move) && move.location.type !== LocationType.PlayerHelpLine) {
      moves.push(...this.drawCardActions(move))
    } else if (isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.ActionToken) {
      moves.push(...super.afterItemMove(move))
    }

    return moves
  }

  playerHasSankiCard(player: Season | undefined) {
    return this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.player === player).getQuantity() > 0
  }

  drawCardActions(move: ItemMove) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.AnimalCard)(move)) {
      const movedAnimal = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex)
      let offerSankiCard = false

      const animalSeason = getAnimalSeason(movedAnimal.id)
      // Probably the Stag check is not needed
      if (animalSeason !== undefined && movedAnimal.id !== Animal.Stag) {
        if (this.material(MaterialType.SpiritCard).id(SpiritType.Onibi).location(l => l.type === LocationType.PlayerSpiritLine && l.player === animalSeason).getQuantity() === 0
          || isVaran(movedAnimal.id)) {
          // If the drawed card is a fire Varan of this player and they have Sanki cards they can use it
          if (isVaran(movedAnimal.id) && animalSeason === this.player && this.playerHasSankiCard(this.player)) {
              offerSankiCard = true
              moves.push(this.startRule(RuleId.UseSankiCard))
          } else if (isVaran(movedAnimal.id) && animalSeason === this.nextPlayer && this.playerHasSankiCard(this.nextPlayer)) {
              offerSankiCard = true
              this.memorize(Memory.UseSankiOnOtherPlayerTurn, true)
              moves.push(this.startPlayerTurn(RuleId.UseSankiCard, this.nextPlayer))
          } else {
            moves.push(this.material(MaterialType.AnimalCard).index(move.itemIndex).moveItem({ type: LocationType.PlayerHelpLine, player: animalSeason }))
          }
        }
      }

      const movedAnimalProperties = animalProperties[movedAnimal.id]
      if (movedAnimalProperties.type === AnimalType.Solitary && !offerSankiCard) {
        // Check number of solitary symbols
        for (const season of seasons) {
          if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(season).getQuantity() > 0
            && new AnimalsHelper(this.game, this.player).checkTooManySolitaryAnimals(season)) {
            moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(season).moveItem({ type: LocationType.PlayerActionLost, player: season }))
          }
        }
      }

      if (!offerSankiCard && !isVaran(movedAnimal.id)) {
        // If the player has enough action tokens and a Sanki card, offer using it if it's not already been offered because of a fire Varan
        // The action tokens have not moved here yet, that's why I need to check the last move
        // We don't offer it in case the other player doesn't have any action token, as it wouldn't have sense using the Sanki card
        const actionTokens = this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.player)
        if ((actionTokens.getQuantity() == 2 || (actionTokens.getQuantity() == 1 && moves.length > 0 && !isMoveItemType(MaterialType.ActionToken)(moves[moves.length - 1])))
          && this.playerHasSankiCard(this.player)
          && new PlayerUseActionTokenRule(this.game).getPlayerMoves().length > 0
          && this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.nextPlayer).getItems().length > 0) {
          moves.push(this.startRule(RuleId.UseSankiCard))
        } else {
          moves.push(this.startRule(RuleId.EndTurn))
        }
      } else if (isVaran(movedAnimal.id) && animalSeason !== this.player && !this.remind(Memory.UseSankiOnOtherPlayerTurn)) {
        moves.push(this.startRule(RuleId.EndTurn))
      }
    }

    return moves
  }
}