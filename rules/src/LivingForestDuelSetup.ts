import { MaterialGameSetup } from '@gamepark/rules-api'
import { LivingForestDuelOptions } from './LivingForestDuelOptions'
import { LivingForestDuelRules } from './LivingForestDuelRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Season, seasons } from './Season'
import { RuleId } from './rules/RuleId'
import { getTreeType, Tree, treeCards, treeTypes } from './material/Tree'
import { Animal, commonAnimals, getAnimalSeason, summerAnimals, winterAnimals } from './material/Animal'
import { minBy } from 'lodash'
import { SpiritType } from './material/SpiritType'
import { AnimalsHelper } from './rules/helpers/CardsHelper'
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
    for (let i = 1; i <= 3; i++) {
      const x = season === Season.Summer ? -i : i
      seasonDeck.dealOne({ type: LocationType.RecruitmentLine, x })
    }
    // Check initial animals cost
    const animalsHelper = new AnimalsHelper(this.game, season)
    let filteredProperties = animalsHelper.getAnimalsProperties(this.getInitialSeasonAnimalsIds(season))
    let totalCost = animalsHelper.getCostSum(filteredProperties)
    while (totalCost <= 12) {
      const minCostElementId = Number(Object.keys(filteredProperties).find(key => filteredProperties[key].cost === minBy(Object.values(filteredProperties), 'cost').cost))
      const element = this.material(MaterialType.AnimalCard).id(minCostElementId).getItem()
      seasonDeck.dealOne({ type: LocationType.RecruitmentLine, x: element!.location.x })
      this.material(MaterialType.AnimalCard).id(minCostElementId).moveItem({ type: LocationType.SeasonAnimalDeck, id: season, x: 0 })
      filteredProperties = animalsHelper.getAnimalsProperties(this.getInitialSeasonAnimalsIds(season))
      totalCost = animalsHelper.getCostSum(filteredProperties)
    }
    // // TODO: Remove the line below. Using it just for testing purposes
    // this.material(MaterialType.AnimalCard).location(LocationType.SeasonAnimalDeck).moveItems({type: LocationType.SharedDeck})

    // Player tree area
    this.material(MaterialType.TreeCard).createItem({
      id: season === Season.Summer ? Tree.SummerStartingTree : Tree.WinterStartingTree,
      location: {
        type: LocationType.PlayerForest,
        id: season
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

  getInitialSeasonAnimalsIds(season: number) {
    return this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.RecruitmentLine).getItems()
      .filter(animal => { return getAnimalSeason(animal.id) === season }).map(animal => animal.id)
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
    this.startPlayerTurn(RuleId.PlayerAction, this.players[0])
  }
}