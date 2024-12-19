import { isMoveItemType, ItemMove, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Animal, animalProperties, AnimalType, getAnimalSeason, isVaran } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { Season, seasons } from '../Season'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { Memory } from './Memory'
import { PlayerTurnHelper } from './PlayerTurnHelper'
import { PlayerUseActionTokenRule } from './PlayerUseActionTokenRule'
import { RuleId } from './RuleId'

export class PlayerActionRule extends PlayerUseActionTokenRule {
  onRuleStart() {
    this.memorize(Memory.CurrentPlayer, this.player)
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    // Add one card to the shared help line
    const sharedDeck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).deck()
    moves.push(sharedDeck.dealOne({ type: LocationType.SharedHelpLine }))
    moves.push(...super.getPlayerMoves())

    return moves
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.AnimalCard)(move)) {
      if (move.location.type === LocationType.SharedHelpLine) {
        return this.afterDrawCard(move)
      } else if (move.location.type === LocationType.PlayerHelpLine) {
        const animal = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex).id
        return this.afterAnimalMovedAtFinalDestination(animal)
      }
    } else if (isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.PointElement) {
      return super.afterItemMove(move)
    }
    return []
  }

  afterDrawCard(move: MoveItem) {
    const moves: MaterialMove[] = []
    if (this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).length === 0) {
      const discard = this.material(MaterialType.AnimalCard).location(LocationType.SharedDiscardPile)
      moves.push(discard.moveItemsAtOnce({ type: LocationType.SharedDeck }))
      moves.push(discard.shuffle())
    }
    const animal = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex).id
    const animalSeason = getAnimalSeason(animal)
    if (animalSeason !== undefined) {
      if (isVaran(animal) && this.playerHasSankiCard(animalSeason)) {
        return moves.concat(this.offerToUseSankiOnVaran(animalSeason))
      } else if (isVaran(animal) || !this.playerHasOnibiCard(animalSeason)) {
        return moves.concat(this.material(MaterialType.AnimalCard).index(move.itemIndex).moveItem({ type: LocationType.PlayerHelpLine, player: animalSeason }))
      }
    }
    return moves.concat(this.afterAnimalMovedAtFinalDestination(animal))
  }

  playerHasSankiCard(player: Season) {
    return this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(LocationType.PlayerSpiritLine).player(player).length > 0
  }

  offerToUseSankiOnVaran(player: Season) {
    if (player === this.player) {
      return [this.startRule(RuleId.UseSankiOnVaran)]
    } else {
      return [this.startPlayerTurn(RuleId.UseSankiOnVaran, this.nextPlayer)]
    }
  }

  playerHasOnibiCard(player: Season) {
    return this.material(MaterialType.SpiritCard).id(SpiritType.Onibi).location(LocationType.PlayerSpiritLine).player(player).length > 0
  }

  afterAnimalMovedAtFinalDestination(animal: Animal) {
    const moves: MaterialMove[] = []
    if (animalProperties[animal].type === AnimalType.Solitary) {
      // Check number of solitary symbols
      for (const season of seasons) {
        if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(season).getQuantity() > 0
          && new AnimalsHelper(this.game).checkTooManySolitaryAnimals(season)) {
          moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(season).moveItem({
            type: LocationType.PlayerActionLost,
            player: season
          }))
        }
      }
    }
    if (!isVaran(animal) && this.playerHasSankiCard(this.player) && this.opponentHasActionToken) {
      moves.push(this.startRule(RuleId.UseSankiPlayAction))
    } else {
      moves.push(new PlayerTurnHelper(this.game).endCurrentPlayerTurn())
    }

    return moves
  }

  get opponentHasActionToken() {
    return this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.nextPlayer).length > 0
  }
}