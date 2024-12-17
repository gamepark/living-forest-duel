import { isMoveItemType, ItemMove, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Animal, animalProperties, AnimalType, getAnimalSeason, isVaran } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { Season, seasons } from '../Season'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { Memory } from './Memory'
import { PlayerUseActionTokenRule } from './PlayerUseActionTokenRule'
import { RuleId } from './RuleId'

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
    if (isMoveItemType(MaterialType.AnimalCard)(move)) {
      if (move.location.type === LocationType.SharedHelpLine) {
        return this.afterDrawCard(move)
      } else if (move.location.type === LocationType.PlayerHelpLine) {
        const animal = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex).id
        return this.afterAnimalMovedAtFinalDestination(animal)
      }
    } else if (isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.ActionToken) {
      return super.afterItemMove(move)
    }
    return []
  }

  afterDrawCard(move: MoveItem) {
    const animal = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex).id
    const animalSeason = getAnimalSeason(animal)
    if (animalSeason !== undefined) {
      if (isVaran(animal) && this.playerHasSankiCard(animalSeason)) {
        return this.offerToUseSankiOnVaran(animalSeason)
      } else if (isVaran(animal) || !this.playerHasOnibiCard(animalSeason)) {
        return [this.material(MaterialType.AnimalCard).index(move.itemIndex).moveItem({ type: LocationType.PlayerHelpLine, player: animalSeason })]
      }
    }
    return this.afterAnimalMovedAtFinalDestination(animal)
  }

  playerHasSankiCard(player: Season) {
    return this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(LocationType.PlayerSpiritLine).player(player).length > 0
  }

  offerToUseSankiOnVaran(player: Season) {
    if (player === this.player) {
      return [this.startRule(RuleId.UseSankiCard)]
    } else {
      this.memorize(Memory.UseSankiOnOtherPlayerTurn, true)
      return [this.startPlayerTurn(RuleId.UseSankiCard, this.nextPlayer)]
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
          && new AnimalsHelper(this.game, this.player).checkTooManySolitaryAnimals(season)) {
          moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(season).moveItem({
            type: LocationType.PlayerActionLost,
            player: season
          }))
        }
      }
    }
    if (this.playerHasSankiCard(this.player)
      && this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(this.nextPlayer).length > 0) {
      moves.push(this.startRule(RuleId.UseSankiCard))
    } else {
      moves.push(this.startRule(RuleId.EndTurn))
    }

    return moves
  }
}