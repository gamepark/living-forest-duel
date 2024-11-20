import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { TreesHelper } from './helpers/CardsHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { LocationType } from '../material/LocationType'
// import { MaterialType } from '../material/MaterialType'
// import { LocationType } from '../material/LocationType'

export class PlantingProtectiveTreeRule extends PlayerTurnRule {
  onRuleStart() {
    const treesIds = new TreesHelper(this.game, this.player).getVisibleTreesInStack().getItems().map(tree => tree.id)
    const minCost = new TreesHelper(this.game, this.player).getTreesMinCost(treesIds) || 0
    
    if (minCost > this.remind(Memory.RemainingElementValue)) {
      return [this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer)]
    }

    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    const availableTrees = new TreesHelper(this.game, this.player).getVisibleTreesInStack()
    // const playerCards = this.material(MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
    //   .filter((animal) => getAnimalSeason(animal.id) === this.player && this.remind(Memory.RemainingElementValue) >= animalProperties[animal.id as Animal]?.cost!)
    moves.push(...availableTrees.moveItems({ type: LocationType.PlayerForest, id: this.player }))

    return moves
  }

}