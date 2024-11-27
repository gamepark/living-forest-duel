import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMoveType } from '@gamepark/rules-api'
import { Animal, animalProperties, AnimalType, CardElements, getAnimalSeason, isVaran } from '../material/Animal'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { SpiritType } from '../material/SpiritType'
import { Element, seasons } from '../Season'
import { AnimalsHelper } from './helpers/AnimalsHelper'
import { ElementsHelper } from './helpers/ElementsHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

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
    if (this.availableActionTokens.getQuantity() > 0) {
      moves.push(...this.getAvailableActions())
    }
    // if (this.availableActionTokens.getQuantity() > 0
    //     && this.getActivePlayer() === this.game.players[0]) { // TODO: Remove this. Just for testing purposes to avoid monkey opponent playing the action
    //   moves.push(...this.getAvailableActions())
    // }

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
      const card = sharedCards.location(l => l.x === x).getItem<Animal>()!
      const cardProperties = animalProperties[card.id]
      for (const element of Object.keys(maxElements)) {
        const elementKey = element as keyof CardElements
        if (maxElements[elementKey]! < 0 && cardProperties.elements[elementKey] !== undefined) {
          maxElements[elementKey] = card.id
        }
      }

      // If we already have the 4 positions, exit the loop
      if (Object.values(maxElements).every(value => value !== undefined && value > 0)) {
        break
      }
    }

    // Validate the positions. At least 1 element between the action token and the previous one.
    for (const element of Object.keys(maxElements) as (keyof CardElements)[]) {
      const elementIndex = Object.keys(maxElements).indexOf(element) + 1
      let cardsWithElement = 0
      for (let x = this.material(MaterialType.AnimalCard).id(maxElements[element]).getItem()?.location.x; x! >= 0; x!--) {
        const card = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedHelpLine && l.x === x).getItem<Animal>()!
        const cardProperties = animalProperties[card.id]
        if (cardProperties.elements[element] !== undefined) {
          if (this.material(MaterialType.ActionToken).location(l => l.type === LocationType.ActionToken && l.x === card.location.x && l.y === elementIndex).getQuantity() > 0) {
            maxElements[element] = -1
            break
          } else {
            cardsWithElement++
            if (cardsWithElement == 2) break
          }
        }
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

    if (isMoveItemType(MaterialType.AnimalCard)(move) && move.location.type !== LocationType.PlayerHelpLine) {
      moves.push(...this.drawCardActions(move))
      // If there is a start rule it's the sanki card, so we still don't check the end of the turn
      if (moves.length === 0 || moves[moves.length - 1].type !== RuleMoveType.StartRule) {
        moves.push(this.startRule(RuleId.CheckEndTurn))
      }
      // moves.push(this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer))
    } else if (isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.ActionToken) {
      this.memorize(Memory.PlantedTrees, [])
      this.memorize(Memory.BonusAction, 0)
      switch (move.location.y) {
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
          new ElementsHelper(this.game, this.player).setRemainingElementValue(Element.Wind)
          moves.push(this.startRule(RuleId.AdvancingOnibi))
          break
      }
    }

    return moves
  }

  drawCardActions(move: ItemMove<number, number, number>) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.AnimalCard)(move)) {
      const movedAnimal = this.material(MaterialType.AnimalCard).getItem<Animal>(move.itemIndex)
      let checkSolitaryAnimals = true

      const animalSeason = getAnimalSeason(movedAnimal.id)
      if (animalSeason !== undefined && movedAnimal.id !== Animal.Stag) {
        if (this.material(MaterialType.SpiritCard).id(SpiritType.Onibi).location(l => l.type === LocationType.PlayerSpiritLine && l.id === animalSeason).getQuantity() === 0
          || isVaran(movedAnimal.id)) {
          // I need the location for the Varan, as all Varan cards have the same id
          moves.push(this.material(MaterialType.AnimalCard).id(movedAnimal.id).location(l => l.type === movedAnimal.location.type && l.x === movedAnimal.location.x).moveItem({ type: LocationType.PlayerHelpLine, id: animalSeason }))
          // If the drawed card is a fire Varan of this player and they have Sanki cards they can use it
          if (isVaran(movedAnimal.id)
            && animalSeason === this.player
            && this.material(MaterialType.SpiritCard).id(SpiritType.Sanki).location(l => l.type === LocationType.PlayerSpiritLine && l.id === this.player).getQuantity() > 0) {
            moves.push(this.startRule(RuleId.UseSankiCard))
            checkSolitaryAnimals = false
          }
        } else {
          moves.push(this.material(MaterialType.AnimalCard).id(movedAnimal.id).moveItem({ type: LocationType.SharedHelpLine }))
        }
      }

      const movedAnimalProperties = animalProperties[movedAnimal.id]
      if (movedAnimalProperties.type === AnimalType.Solitary) {
        // Check number of solitary symbols
        for (const season of seasons) {
          if (checkSolitaryAnimals
            && new AnimalsHelper(this.game, this.player).checkTooManySolitaryAnimals(season)
            && this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(season).getQuantity() > 0) {
            // TODO: Implement this in other way (e.g. disabling or with a cross) or fade it out
            moves.push(this.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).id(season).moveItem({type: LocationType.PlayerActionLost, id: season}))
          }
        }
      }
    }

    return moves
  }
}