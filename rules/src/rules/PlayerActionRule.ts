import { isMoveItemType, ItemMove, MaterialMove, PlayMoveContext } from '@gamepark/rules-api'
import { Animal, animalProperties, AnimalType, getAnimalSeason, isVaran } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { seasons } from '../Season'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { RuleId } from './RuleId'
import { PlayerUseActionTokenRule } from './PlayerUseActionTokenRule'

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

  afterItemMove(move: ItemMove<number, number, number>, _context?: PlayMoveContext) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.AnimalCard)(move) && move.location.type !== LocationType.PlayerHelpLine) {
      moves.push(...this.drawCardActions(move))
      // // If the player has enough action tokens and a Sanki card, offer using it
      // // The action tokens have not moved here yet, that's why I need to check the last move
      // // We don't offer it in case the other player doesn't have any action token, as it wouldn't have sense using the Sanki card
      // const actionTokens = this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player).getItems()
      // if ((moves.length == 0
      //   || actionTokens.length == 2
      //   || (actionTokens.length == 1 && moves.length > 0 && !isMoveItemType(MaterialType.ActionToken)(moves[moves.length - 1])))
      //   && this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.id === this.player).getQuantity() > 0
      //   && new PlayerUseActionTokenRule(this.game).getPlayerMoves().length > 0
      //   && this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.nextPlayer).getItems().length > 0) {
      //   moves.push(this.startRule(RuleId.UseSankiCard))
      // } else {
      //   moves.push(this.startRule(RuleId.EndTurn))
      // }
    } else if (isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.ActionToken) {
      moves.push(...super.afterItemMove(move))
    }

    return moves
  }

  playerHasSankiCard() {
    return this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.id === this.player).getQuantity() > 0
  }

  drawCardActions(move: ItemMove<number, number, number>) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.AnimalCard)(move)) {
      const movedAnimal = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex)
      let checkSolitaryAnimals = true

      const animalSeason = getAnimalSeason(movedAnimal.id)
      // Probably the Stag check is not needed
      if (animalSeason !== undefined && movedAnimal.id !== Animal.Stag) {
        if (this.material(MaterialType.SpiritCard).id(SpiritType.Onibi).location(l => l.type === LocationType.PlayerSpiritLine && l.id === animalSeason).getQuantity() === 0
          || isVaran(movedAnimal.id)) {
          // If the drawed card is a fire Varan of this player and they have Sanki cards they can use it
          if (isVaran(movedAnimal.id) && animalSeason === this.player&& this.playerHasSankiCard()) {
            checkSolitaryAnimals = false
            moves.push(this.startRule(RuleId.UseSankiCard))
          } else {
            moves.push(this.material(MaterialType.AnimalCard).index(move.itemIndex).moveItem({ type: LocationType.PlayerHelpLine, id: animalSeason }))
          }
        // } else {
        //   moves.push(this.material(MaterialType.AnimalCard).id(movedAnimal.id).moveItem({ type: LocationType.SharedHelpLine }))
        }
      }

      const movedAnimalProperties = animalProperties[movedAnimal.id]
      if (movedAnimalProperties.type === AnimalType.Solitary) {
        // Check number of solitary symbols
        for (const season of seasons) {
          if (checkSolitaryAnimals
            && new AnimalsHelper(this.game, this.player).checkTooManySolitaryAnimals(season)
            && this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(season).getQuantity() > 0) {
            moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(season).moveItem({ type: LocationType.PlayerActionLost, id: season }))
          }
        }
      }

      // If the player has enough action tokens and a Sanki card, offer using it if it's not already been offered because of a fire Varan
      // The action tokens have not moved here yet, that's why I need to check the last move
      // We don't offer it in case the other player doesn't have any action token, as it wouldn't have sense using the Sanki card
      const actionTokens = this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player).getItems()
      if ((moves.length == 0 || (moves.length > 0 && !isMoveItemType(MaterialType.SpiritCard)(moves[moves.length - 1]))
        && (actionTokens.length == 2 || (actionTokens.length == 1 && moves.length > 0 && !isMoveItemType(MaterialType.ActionToken)(moves[moves.length - 1])))) 
        && this.playerHasSankiCard()
        && new PlayerUseActionTokenRule(this.game).getPlayerMoves().length > 0
        && this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.nextPlayer).getItems().length > 0) {
        moves.push(this.startRule(RuleId.UseSankiCard))  
      } else {
        moves.push(this.startRule(RuleId.EndTurn))
      }
    }

    return moves
  }
}