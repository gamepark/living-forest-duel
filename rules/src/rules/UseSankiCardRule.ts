import { CustomMove, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { SpiritType } from '../material/SpiritType'
import { CustomMoveType } from './CustomMoveType'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { RuleId } from './RuleId'
import { Animal, getAnimalSeason, isVaran } from '../material/Animal'
import { PlayerUseActionTokenRule } from './PlayerUseActionTokenRule'
import { Memory } from './Memory'

export class UseSankiCardRule extends PlayerTurnRule {
  onRuleStart() {
    // When offering a Sanki card there's still the case that it's considering if offering it or not with a player's card still in the shared line
    // Double checking it here just for simplicity
    // TODO: Improve this to only do it once if possible
    if (this.lastSharedCardVaran.getItem() === undefined && new PlayerUseActionTokenRule(this.game).getPlayerMoves().length === 0) {
      return [this.startRule(RuleId.EndTurn)]
    }
    return []
  }

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
    if (!this.remind(Memory.UseSankiOnOtherPlayerTurn)) {
      moves.push(this.startRule(RuleId.EndTurn))
    } else {
      moves.push(this.startPlayerTurn(RuleId.EndTurn, this.nextPlayer))
    }

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