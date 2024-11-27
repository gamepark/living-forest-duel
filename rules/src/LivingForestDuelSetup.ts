import { MaterialGameSetup } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { LivingForestDuelOptions } from './LivingForestDuelOptions'
import { LivingForestDuelRules } from './LivingForestDuelRules'
import { Animal, animalProperties, commonAnimals, getAnimalSeason, summerAnimals, winterAnimals } from './material/Animal'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { SpiritType } from './material/SpiritType'
import { getTreeType, Tree, treeCards, treeTypes } from './material/Tree'
import { RuleId } from './rules/RuleId'
import { Season, seasons } from './Season'

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
    this.setupSharedDeck()
  }

  setupClearing() {
    this.material(MaterialType.OnibiStandee).createItem({
      location: {
        type: LocationType.ClearingCardSpot,
        x: 0
      }
    })

    const firePositions = [-1, 1]
    for (const x of firePositions) {
      this.material(MaterialType.FireToken).createItem({
        id: MaterialType.FireToken,
        location: {
          type: LocationType.ClearingCardSpot,
          x
        }
      })
    }
  }

  setupTreeDecks() {
    const trees = treeCards.map(card => ({
      id: card,
      location: {
        type: LocationType.TreeDeckSpot,
        id: getTreeType(card)
      }
    }))
    this.material(MaterialType.TreeCard).createItems(trees)
    // this.material(MaterialType.TreeCard).location(l => l.type === LocationType.TreeDeckSpot && l.id ).shuffle()
    for (const treeType of treeTypes) {
      this.material(MaterialType.TreeCard).location(l => l.id === treeType).shuffle()
    }
  }

  setupSharedDeck() {
    this.material(MaterialType.AnimalCard).createItems(commonAnimals.map((animal) => ({
      id: animal, location: { type: LocationType.SharedDeck }
    })))

    this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedDeck).shuffle()
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
    // Player season deck
    this.material(MaterialType.AnimalCard).createItem({
      id: season === Season.Summer ? Animal.SummerVaran : Animal.WinterVaran,
      location: {
        type: LocationType.VaranDeck,
        id: season
      },
      quantity: 7
    })
    const seasonAnimals = season === Season.Summer ? summerAnimals : winterAnimals

    // Player initial cards
    this.material(MaterialType.AnimalCard).createItems(seasonAnimals.map((animal) => ({
      id: animal, location: { type: LocationType.SeasonAnimalDeck, id: season }
    })))
    this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.id === season).shuffle()
    const seasonDeck = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.id === season).deck()
    seasonDeck.deal({ type: LocationType.RecruitmentLine }, 3)
    // Check initial animals cost
    while (this.getInitialRecruitmentCost(season) <= 12) {
      const minCostCard = this.getSeasonRecruitmentCards(season).minBy(item => animalProperties[item.id as Animal].cost)
      minCostCard.moveItem({ type: LocationType.SeasonAnimalDeck, id: season, x: 0 })
      seasonDeck.dealOne({ type: LocationType.RecruitmentLine })
    }
    // // TODO: Remove the line below. Using it just for testing purposes
    // this.material(MaterialType.AnimalCard).location(LocationType.SeasonAnimalDeck).moveItems({type: LocationType.SharedDeck})

    // Player tree area
    this.material(MaterialType.TreeCard).createItem({
      id: season === Season.Summer ? Tree.SummerStartingTree : Tree.WinterStartingTree,
      location: {
        type: LocationType.PlayerForest,
        id: season,
        x: 0,
        y: 0,
        z: 0
      }
    })

    // Action tokens
    for (let y = 0; y < 2; y++) {
      this.material(MaterialType.ActionToken).createItem({
        id: season,
        location: {
          type: LocationType.PlayerActionSupply,
          id: season,
          y
        }
      })
    }
  }

  getInitialRecruitmentCost(season: Season) {
    return sumBy(this.getSeasonRecruitmentCards(season).getItems<Animal>(), item => animalProperties[item.id].cost)
  }

  getSeasonRecruitmentCards(season: Season) {
    return this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).id<Animal>(animal => getAnimalSeason(animal) === season)
  }

  setupSupply() {
    this.material(MaterialType.FireToken).createItem({
      location: {
        type: LocationType.FireStock
      },
      quantity: 17
    })

    this.material(MaterialType.SpiritCard).createItem({
      id: SpiritType.Onibi,
      location: {
        type: LocationType.OnibiCard
      }
    })

    this.material(MaterialType.SpiritCard).createItem({
      id: SpiritType.Sanki,
      location: {
        type: LocationType.SankiDeck
      },
      quantity: 3
    })
  }

  start() {
    // Summer always starts
    this.startPlayerTurn(RuleId.PlayerAction, Season.Summer)
  }
}