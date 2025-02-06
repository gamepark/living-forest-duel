import { LivingForestDuelSetup } from '@gamepark/living-forest-duel/LivingForestDuelSetup'
import { Animal, animalProperties } from '@gamepark/living-forest-duel/material/Animal'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { Tree, TreeId } from '@gamepark/living-forest-duel/material/Tree'
import { Element, Season } from '@gamepark/living-forest-duel/Season'

export class TutorialSetup extends LivingForestDuelSetup {
  setupSharedDeck() {
    super.setupSharedDeck()
    this.material(MaterialType.AnimalCard).id(Animal.Lynx).moveItem({ type: LocationType.SharedDeck })
    this.material(MaterialType.AnimalCard).id(Animal.Bear).moveItem({ type: LocationType.SharedDeck })
    this.material(MaterialType.AnimalCard).id(Animal.Peacock).moveItem({ type: LocationType.SharedDeck })
    this.material(MaterialType.AnimalCard).id(Animal.Anteater).moveItem({ type: LocationType.SharedDeck })
  }

  setupTreeDecks() {
    super.setupTreeDecks()
    this.material(MaterialType.TreeCard).id<TreeId>(id => id.front === Tree.SunTree5).moveItem({ type: LocationType.TreeDeckSpot, id: Element.Sun, rotation: false })
  }

  setupPlayerRecruitmentLine(season: Season) {
    const mandatoryCard = season === Season.Summer ? Animal.Hummingbird : Animal.Ram
    this.material(MaterialType.AnimalCard).id(mandatoryCard).moveItem({ type: LocationType.SeasonAnimalDeck, player: season })
    const seasonDeck = this.material(MaterialType.AnimalCard).location(LocationType.SeasonAnimalDeck).player(season).deck()
    seasonDeck.deal({ type: LocationType.RecruitmentLine }, 3)
    // Check initial animals cost
    while (this.getInitialRecruitmentCost(season) <= 12) {
      const minCostCard = this.getSeasonRecruitmentCards(season).id(animal => animal !== mandatoryCard).minBy(item => animalProperties[item.id as Animal].cost)
      minCostCard.moveItem({ type: LocationType.SeasonAnimalDeck, player: season, x: 0 })
      seasonDeck.dealOne({ type: LocationType.RecruitmentLine })
    }
  }
}