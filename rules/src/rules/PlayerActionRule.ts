import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Animal, AnimalSeason, getAnimalSeason } from '../material/Animal'

export class PlayerActionRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = []
    
    // Add one card to the shared help line
    const sharedDeck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).deck()
    moves.push(sharedDeck.dealOne({ type: LocationType.SharedHelpLine }))
    // Or add one action token to one card in the shared help line
    // this.availableActionTokens.moveItems()
    return moves
  }

  get availableActionTokens() {
    return this.material(MaterialType.ActionToken).id(this.player).location(LocationType.PlayerActionSupply)
  }

  afterItemMove(move: ItemMove<number, number, number>, _context?: PlayMoveContext) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.AnimalCard)(move) && move.location.type !== LocationType.PersonalHelpLine) {
      const movedAnimal = this.material(MaterialType.AnimalCard).getItem(move.itemIndex)
      if (getAnimalSeason(movedAnimal.id) !== AnimalSeason.Common && movedAnimal.id !== Animal.Stag) {
        const animalSeason = getAnimalSeason(movedAnimal.id)
        moves.push(this.material(MaterialType.AnimalCard).id(movedAnimal.id).moveItem({ type: LocationType.PersonalHelpLine, id: animalSeason }))
      }
    }

    return moves
  }
}