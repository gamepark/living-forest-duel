import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Animal, animalProperties, AnimalSeason, AnimalType, CardElements, getAnimalSeason } from '../material/Animal'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { countBy } from 'lodash'
import { Element, seasons } from '../Season'
import { RuleId } from './RuleId'
import { Memory } from './Memory'
import { ElementsHelper } from './helpers/ElementsHelper'

export class PlayerActionRule extends PlayerTurnRule {
  onRuleStart() {
    if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(this.player).getQuantity() === 0) {
      return [this.startRule(RuleId.CheckEndTurn)]
    } else {
      return []
    }
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    // Add one card to the shared help line
    const sharedDeck = this.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).deck()
    moves.push(sharedDeck.dealOne({ type: LocationType.SharedHelpLine }))
    // Or add one action token to one card in the shared help line
    if (this.availableActionTokens.getQuantity() > 0
        && this.getActivePlayer() === this.game.players[0]) { // TODO: Remove this. Just for testing purposes to avoid monkey opponent playing the action
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
      moves.push(this.startRule(RuleId.CheckEndTurn))
    } else if (isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.ActionToken) {
      this.memorize(Memory.PlantedTrees, [])
      this.memorize(Memory.BonusAction, false)
      switch(move.location.y) {
        case Element.Sun:
          new ElementsHelper(this.game, this.player).setRemainingElementValue(Element.Sun)
          moves.push(this.startRule(RuleId.RecruitingAnimals))
          break
        case Element.Water:
          new ElementsHelper(this.game, this.player).setRemainingElementValue(Element.Water)
          moves.push(this.startRule(RuleId.ExtinguishingFire))
          break
        case Element.Plant:
          new ElementsHelper(this.game, this.player).setRemainingElementValue(Element.Plant)
          moves.push(this.startRule(RuleId.PlantingProtectiveTree))
          break
        case Element.Wind:
          moves.push(this.startRule(RuleId.AdvancingOnibi))
          break
      }
    }
    
    
    return moves
  }

  // setRemainingElementValue(elementType: Element) {
  //   let elementValue = 0

  //   const tokensLocations = this.material(MaterialType.ActionToken)
  //     .location(l => l.type === LocationType.ActionToken && l.y === elementType)
  //     .getItems()
  //     .sort((a,b) => b.location.x! - a.location.x!)
  //   const tokenLocationX = tokensLocations[0].location.x
  //   const previousTokenLocationX = tokensLocations[1]?.location.x ?? -1
  //   for (let x = tokenLocationX!; x > previousTokenLocationX; x--) {
  //     const card = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine && l.x === x).getItem()
  //     const cardProperties = animalProperties[card?.id as Animal]
  //     elementValue += cardProperties?.elements[Element[elementType].toLowerCase() as keyof CardElements]! ?? 0
  //   }
  //   // Add the personal value
  //   const playerCardsids = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.PersonalHelpLine && l.id === this.player).getItems().map(card => card.id)
  //   elementValue += new AnimalsHelper(this.game, this.player).getAnimalsCostSum(playerCardsids)

  //   console.log("Computed element value: ", elementValue)
  //   this.memorize(Memory.RemainingElementValue, elementValue)
  //   this.memorize(Memory.PlantedTrees, [])
  // }

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
            // TODO: Remove this "if" when the rules workflow is correctly implemented as it should not be necessary
            if (this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(season).getQuantity() > 0) {
              // TODO: Implement this in other way (e.g. disabling or with a cross) or fade it out
              moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(season).deleteItem())
            }
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
}