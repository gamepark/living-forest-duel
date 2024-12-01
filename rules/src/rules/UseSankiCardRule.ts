import { CustomMove, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { SpiritType } from '../material/SpiritType'
import { CustomMoveType } from './CustomMoveType'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { RuleId } from './RuleId'
import { Animal, getAnimalSeason, isVaran } from '../material/Animal'

export class UseSankiCardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const playerSankiCards = this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.id === this.player)
    moves.push(...playerSankiCards.moveItems({ type: LocationType.SankiDeck }))
    moves.push(this.customMove(CustomMoveType.SankiPass))

    return moves
  }

  onCustomMove(move: CustomMove) {
    const moves: MaterialMove[] = []
    // If pass and last card is a Varan, check solitary animals
    const lastCardVaran = this.lastSharedCardVaran
    if (move.type === CustomMoveType.SankiPass && lastCardVaran.getItem() !== undefined) {
      moves.push(this.material(MaterialType.AnimalCard).index(lastCardVaran.getIndex()).moveItem({ type: LocationType.PlayerHelpLine, id: this.player }))
      if (new AnimalsHelper(this.game, this.player).checkTooManySolitaryAnimals(this.player)) {
        const actionToken = this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player)
        moves.push(actionToken.moveItem({ type: LocationType.PlayerActionLost, id: this.player }))
      }
    }
    // moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    moves.push(this.startRule(RuleId.EndTurn))

    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []

    if (isMoveItemType(MaterialType.SpiritCard)(move)) {
      // Get the last card in the shared deck to see if it's a player's Varan
      const lastCardVaran = this.lastSharedCardVaran
      if (lastCardVaran.getItem() !== undefined) {
        moves.push(lastCardVaran.moveItem({ type: LocationType.VaranDeck, id: this.player }))
        moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
      } else {
        moves.push(this.startRule(RuleId.PlayerUseActionToken))
      }
    }

    return moves
  }

  get lastSharedCardVaran() {
    const cardsInHelpLine = this.material(MaterialType.AnimalCard).location(LocationType.SharedHelpLine)
    const cardsItems = cardsInHelpLine.getItems()
    return cardsInHelpLine.location(l => !cardsItems.some(item => item.location.x! > l.x!)).id<Animal>(animal => getAnimalSeason(animal) === this.player && isVaran(animal))
  }
}