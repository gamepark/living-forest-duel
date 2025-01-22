import { MaterialGameSetup } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { LivingForestDuelOptions } from './LivingForestDuelOptions'
import { LivingForestDuelRules } from './LivingForestDuelRules'
import { Animal, animalProperties, commonAnimals, getAnimalSeason, summerAnimals, winterAnimals } from './material/Animal'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { SpiritType } from './material/SpiritType'
import { getTreeElement, Tree, treeCards } from './material/Tree'
import { RuleId } from './rules/RuleId'
import { elements, Season, seasons } from './Season'

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
    const trees = treeCards.map(tree => ({
      id: { front: tree, back: getTreeElement(tree) },
      location: {
        type: LocationType.TreeDeckSpot,
        id: getTreeElement(tree),
        rotation: true
      }
    }))
    this.material(MaterialType.TreeCard).createItems(trees)
    for (const element of elements) {
      this.material(MaterialType.TreeCard).location(l => l.id === element).shuffle()
      this.material(MaterialType.TreeCard).location(l => l.id === element).maxBy(item => item.location.x!).rotateItem(false)
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
    this.setupPlayerVaranDeck(season)
    this.setupPlayerAnimalDeck(season)
    this.setupPlayerRecruitmentLine(season)
    this.setupPlayerForest(season)
    this.setupPlayerActionTokens(season)
  }

  setupPlayerVaranDeck(season: Season) {
    for (let i = 0; i < 7; i++) {
      this.material(MaterialType.AnimalCard).createItem({
        id: season === Season.Summer ? Animal.SummerVaran : Animal.WinterVaran,
        location: {
          type: LocationType.VaranDeck,
          player: season
        }
      })
    }
  }

  setupPlayerAnimalDeck(season: Season) {
    const animals = season === Season.Summer ? summerAnimals : winterAnimals
    this.material(MaterialType.AnimalCard).createItems(animals.map((animal) => ({
      id: animal, location: { type: LocationType.SeasonAnimalDeck, player: season }
    })))
    this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SeasonAnimalDeck && l.player === season).shuffle()
  }

  setupPlayerRecruitmentLine(season: Season) {
    const seasonDeck = this.material(MaterialType.AnimalCard).location(LocationType.SeasonAnimalDeck).player(season).deck()
    seasonDeck.deal({ type: LocationType.RecruitmentLine }, 3)
    // Check initial animals cost
    while (this.getInitialRecruitmentCost(season) <= 12) {
      const minCostCard = this.getSeasonRecruitmentCards(season).minBy(item => animalProperties[item.id as Animal].cost)
      minCostCard.moveItem({ type: LocationType.SeasonAnimalDeck, player: season, x: 0 })
      seasonDeck.dealOne({ type: LocationType.RecruitmentLine })
    }
  }

  setupPlayerForest(season: Season) {
    this.material(MaterialType.TreeCard).createItem({
      id: { front: season === Season.Summer ? Tree.SummerStartingTree : Tree.WinterStartingTree },
      location: { type: LocationType.PlayerForest, player: season, x: 0, y: 0 }
    })
  }

  setupPlayerActionTokens(season: Season) {
    this.material(MaterialType.ActionToken).createItem({
      id: season,
      location: { type: LocationType.PlayerActionSupply, player: season },
      quantity: 2
    })
  }

  getInitialRecruitmentCost(season: Season) {
    return sumBy(this.getSeasonRecruitmentCards(season).getItems<Animal>(), item => animalProperties[item.id].cost)
  }

  getSeasonRecruitmentCards(season: Season) {
    return this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine).id<Animal>(animal => getAnimalSeason(animal) === season)
  }

  setupSupply() {
    this.material(MaterialType.FireToken).createItem({
      id: MaterialType.FireToken,
      location: {
        type: LocationType.FireStock
      },
      quantity: 19 // Max possible tokens needed in the game are 21
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