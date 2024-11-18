import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Animal, animalProperties, AnimalSeason, AnimalType, CardElements, getAnimalSeason } from '../material/Animal'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { countBy } from 'lodash'
import { seasons } from '../Season'

export class PlayerActionRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = []

    // Add one card to the shared help line
    const sharedDeck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).deck()
    moves.push(sharedDeck.dealOne({ type: LocationType.SharedHelpLine }))
    // Or add one action token to one card in the shared help line
    if (this.availableActionTokens.getQuantity() > 0) {
      moves.push(...this.getAvailableActions())
    }

    return moves
  }

  get availableActionTokens() {
    return this.material(MaterialType.ActionToken).id(this.player).location(LocationType.PlayerActionSupply)
  }

  getAvailableActions() {
    const moves: MaterialMove[] = []
    const sharedCards = this.material(MaterialType.AnimalCard).location(LocationType.SharedHelpLine)
    // Using the CardElements type to store the id of the animal card id that is available in this action
    const maxElements: CardElements = {
      sun: -1,
      water: -1,
      plant: -1,
      wind: -1
    }

    for (let x = sharedCards.getQuantity() - 1; x >= 0; x--) {
      const card = sharedCards.location(l => l.x === x).getItem()
      const cardProperties = animalProperties[card!.id as Animal]
      for (const element of Object.keys(maxElements)) {
        const elementKey = element as keyof CardElements
        if (maxElements[elementKey]! < 0 && cardProperties?.elements[elementKey] !== undefined) {
          maxElements[elementKey] = card!.id
        }
      }

      // If we already have the 4 positions, exit the loop
      if (Object.values(maxElements).every(value => value !== undefined && value > 0)) {
        break
      }
    }

    // Create the moves
    for (const element of Object.keys(maxElements)) {
      const elementCard = maxElements[element as keyof CardElements]!
      if (elementCard > 0) {
        const card = this.material(MaterialType.AnimalCard).id(elementCard)
        moves.push(...this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player)
          .moveItems({ 
            type: LocationType.ActionToken,
            x: card.getItem()?.location.x,
            y: Object.keys(maxElements).indexOf(element) + 1,
            parent: card.getIndex()
          })
        )
      }
    }

    return moves
  }

  afterItemMove(move: ItemMove<number, number, number>, _context?: PlayMoveContext) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.AnimalCard)(move) && move.location.type !== LocationType.PersonalHelpLine) {
      moves.push(...this.drawCard(move))
      // const movedAnimal = this.material(MaterialType.AnimalCard).getItem(move.itemIndex)
      // if (getAnimalSeason(movedAnimal.id) !== AnimalSeason.Common && movedAnimal.id !== Animal.Stag) {
      //   const animalSeason = getAnimalSeason(movedAnimal.id)
      //   moves.push(this.material(MaterialType.AnimalCard).id(movedAnimal.id).moveItem({ type: LocationType.PersonalHelpLine, id: animalSeason }))
      // }
      // const movedAnimalProperties = animalProperties[movedAnimal.id as Animal]
      // if (movedAnimalProperties?.type === AnimalType.Solitary) {
      //   // Check number of solitary symbols
      //   for (const season of seasons) {
      //     if (this.checkTooManySolitaryAnimals(season)) {
      //       // TODO: Implement this in other way (e.g. disabling or with a cross) or fade it out
      //       moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(season).deleteItem())
      //     }
      //   }
      // }
    } else if (isMoveItemType(MaterialType.ActionToken)(move)) {
      moves.push(...this.useActionToken(move))
    }

    return moves
  }

  drawCard(move: ItemMove<number, number, number>) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.AnimalCard)(move)) {
      const movedAnimal = this.material(MaterialType.AnimalCard).getItem(move.itemIndex)
      if (getAnimalSeason(movedAnimal.id) !== AnimalSeason.Common && movedAnimal.id !== Animal.Stag) {
        const animalSeason = getAnimalSeason(movedAnimal.id)
        moves.push(this.material(MaterialType.AnimalCard).id(movedAnimal.id).moveItem({ type: LocationType.PersonalHelpLine, id: animalSeason }))
      }
      const movedAnimalProperties = animalProperties[movedAnimal.id as Animal]
      if (movedAnimalProperties?.type === AnimalType.Solitary) {
        // Check number of solitary symbols
        for (const season of seasons) {
          if (this.checkTooManySolitaryAnimals(season)) {
            // TODO: Implement this in other way (e.g. disabling or with a cross) or fade it out
            moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(season).deleteItem())
          }
        }
      }
    }

    return moves
  }

  checkTooManySolitaryAnimals(season: number) {
    const animalsIds = this.material(MaterialType.AnimalCard)
      .location(l => l.type === LocationType.SharedHelpLine || l.type === LocationType.PersonalHelpLine)
      .filter(animal => [AnimalSeason.Common, season].includes(getAnimalSeason(animal.id)))
      .getItems().map(animal => animal.id)
    const animalsProperties = new AnimalsHelper(this.game, this.player).getAnimalsProperties(animalsIds)
    const totalSolitary = countBy(animalsProperties, animal => animal.type === AnimalType.Solitary).true || 0
    const totalGregarious = countBy(animalsProperties, animal => animal.type === AnimalType.Gregarius).true || 0
    if (totalSolitary - totalGregarious >= 3) {
      return true
    }

    return false
  }

  useActionToken(_move: ItemMove<number, number, number>) {
    const moves: MaterialMove[] = []
    return moves
  }

}