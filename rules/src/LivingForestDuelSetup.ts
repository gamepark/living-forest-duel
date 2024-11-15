import { MaterialGameSetup } from '@gamepark/rules-api'
import { LivingForestDuelOptions } from './LivingForestDuelOptions'
import { LivingForestDuelRules } from './LivingForestDuelRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Season, seasons } from './Season'
import { RuleId } from './rules/RuleId'
import { getTreeType, treeCards, treeTypes } from './material/Tree'
import { Animal, summerAnimals, winterAnimals } from './material/Animal'
// import { clearings } from './material/Clearing'

/**
 * This class creates a new Game based on the game options
 */
export class LivingForestDuelSetup extends MaterialGameSetup<Season, MaterialType, LocationType, LivingForestDuelOptions> {
  Rules = LivingForestDuelRules

  setupMaterial(_options: LivingForestDuelOptions) {
    this.setupClearing()
    this.setupTreeDecks()
    this.setupRecruitment()
    this.setupPlayers()
    this.setupSupply()
  }

  setupClearing() {
    this.material(MaterialType.OnibiStandee).createItem({
      location: {
        type: LocationType.ClearingCardSpot,
        x: 0
      }
    })

    const firePositions = [-1, 1]
    firePositions.forEach(x => {
      this.material(MaterialType.FireToken).createItem({
        id: MaterialType.FireToken,
        location: {
          type: LocationType.ClearingCardSpot,
          x
        }
      })
    })
  }

  setupTreeDecks() {
    const trees = treeCards.map(card => ({
      id: card,
      location: {
        type: LocationType.TreeDecks,
        id: getTreeType(card),
        x: getTreeType(card) - 1
      }
    }))
    this.material(MaterialType.TreeCard).createItems(trees)
    for (const treeType of treeTypes) {
      this.material(MaterialType.TreeCard).location(l => l.x === treeType).shuffle()
    }
  }

  setupRecruitment() {
    this.material(MaterialType.AnimalCard).createItem({
      id: Animal.Stag,
      location: {
        type: LocationType.RecruitmentLine,
        x: 0
      }
    })
  }

  setupPlayers() {
    for (const season of seasons) {
      this.setupPlayer(season)
    }
  }

  setupPlayer(season: Season) {
    this.material(MaterialType.AnimalCard).createItem({
      id: season === Season.Summer ? Animal.SummerVaran : Animal.WinterVaran,
      location: {
        type: LocationType.VaranDeck,
        id: season
      },
      quantity: 7
    })
    const seasonAnimals = season === Season.Summer ? summerAnimals : winterAnimals
    this.material(MaterialType.AnimalCard).createItems(seasonAnimals.map((animal) => ({
      id: animal, location: { type: LocationType.SeasonAnimalDeck, id: season }
    })))
    this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.id === season).shuffle()
    const seasonDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.id === season).deck()
    seasonDeck.deal({ type: LocationType.RecruitmentLine, x: -1}, 3)
  }

  setupSupply() {
    this.material(MaterialType.FireToken).createItem({
      location: {
        type: LocationType.FireStock
      },
      quantity: 17
    })
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}