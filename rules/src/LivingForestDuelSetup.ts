import { MaterialGameSetup } from '@gamepark/rules-api'
import { LivingForestDuelOptions } from './LivingForestDuelOptions'
import { LivingForestDuelRules } from './LivingForestDuelRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Season, seasons } from './Season'
import { RuleId } from './rules/RuleId'
import { getTreeType, Tree, treeCards, treeTypes } from './material/Tree'
import { Animal, animalProperties, commonAnimals, getAnimalSeason, summerAnimals, winterAnimals } from './material/Animal'
import { minBy, sumBy } from 'lodash'
import { SpiritType } from './material/SpiritType'
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
    this.setupCommonDeck()
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
    let filteredProperties = this.getInitialSeasonAnimalsProperties(season)
    let totalCost = this.getInitialSeasonCost(filteredProperties)
    while (totalCost <= 12) {
      const minCostElementId = Number(Object.keys(filteredProperties).find(key => filteredProperties[key].cost === minBy(Object.values(filteredProperties), 'cost').cost));
      const element = this.material(MaterialType.AnimalCard).id(minCostElementId).getItem()
      seasonDeck.dealOne({ type: LocationType.RecruitmentLine, x: element!.location.x })
      this.material(MaterialType.AnimalCard).id(minCostElementId).moveItem({type: LocationType.SeasonAnimalDeck, id: season, x: 0})
      filteredProperties = this.getInitialSeasonAnimalsProperties(season)
      totalCost = this.getInitialSeasonCost(filteredProperties)
    }

    // Player tree area
    this.material(MaterialType.TreeCard).createItem({
      id: season === Season.Summer ? Tree.SummerStartingTree : Tree.WinterStartingTree,
      location: {
        type: LocationType.PlayerTreesArea,
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

  getInitialSeasonAnimalsProperties(season: number) {
    const dealtAnimalsIds = this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.RecruitmentLine).getItems()
      .filter(animal => { return getAnimalSeason(animal.id) === season }).map(animal => animal.id)

    const filteredProperties = Object.keys(animalProperties).reduce((acc, key) => {
      if (dealtAnimalsIds.includes(Number(key))) {
        acc[key] = animalProperties[Number(key) as Animal];
      }
      return acc;
    }, {} as Record<string, any>);

    return filteredProperties
  }

  getInitialSeasonCost(properties: Record<string, any> | ArrayLike<unknown>) {
    return sumBy(Object.values(properties), 'cost')
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

  setupCommonDeck() {
    this.material(MaterialType.AnimalCard).createItems(commonAnimals.map((animal) => ({
      id: animal, location: { type: LocationType.SharedDeck }
    })))

    this.material(MaterialType.AnimalCard).location(l => l.type === LocationType.SharedDeck).shuffle()
  }

  start() {
    this.startPlayerTurn(RuleId.PlayerAction, this.players[0])
  }
}