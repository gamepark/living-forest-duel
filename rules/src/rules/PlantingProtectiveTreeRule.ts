import { directions, isMoveItemType, ItemMove, Location, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { TreesHelper } from './helpers/TreesHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { Tree, treeProperties } from '../material/Tree'

export class PlantingProtectiveTreeRule extends PlayerTurnRule {
  onRuleStart() {
    if (this.getPlayerMoves().length === 0) {
      return [this.startPlayerTurn(RuleId.PlayerAction, this.nextPlayer)]
    }
    
    this.memorize(Memory.RemainingBonuses, [])
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const treesHelper = new TreesHelper(this.game, this.player)
    const availableTrees = treesHelper.getVisibleTreesInStack()
    const availableSpaces: Location[] = treesHelper.availableSpaces

    availableTrees.getItems().forEach(tree => {
      const availableSpacesForTree = new TreesHelper(this.game, this.player).getAvailableSpacesForTree(tree, availableSpaces)
      moves.push(
        ...availableSpacesForTree.flatMap((space) => {
          return [
            ...availableTrees.id(tree.id).moveItems(space)
          ]
        })
      )
    })

    return moves
  }

  beforeItemMove(move: ItemMove<number, number, number>) {
    // Remember the types planted because we can only take one of each type
    if (isMoveItemType(MaterialType.TreeCard)(move) && move.location.type === LocationType.PlayerForest) {
      const movedCard = this.material(move.itemType).getItem(move.itemIndex)

      const plantedTrees = this.remind(Memory.PlantedTrees)
      plantedTrees.push(movedCard.id)
      this.memorize(Memory.PlantedTrees, plantedTrees)

      // Update remaining value
      this.memorize(Memory.RemainingElementValue, this.remind(Memory.RemainingElementValue) - treeProperties[movedCard!.id as Tree]!.cost)

      // Check possible bonuses
      const treesHelper = new TreesHelper(this.game, this.player)      
      const bonuses = []
      for (const direction of directions) {
        if (treesHelper.hasTreeBonusInDirection(movedCard, direction)) {
          bonuses.push(treeProperties[movedCard.id as Tree]?.bonus.element)
        }
      }
  
      if (bonuses.length > 0) {
        this.memorize(Memory.RemainingBonuses, bonuses)
        return [this.startRule(RuleId.TreeBonusAction)]
      } else {
        return [this.startRule(RuleId.PlantingProtectiveTree)]
      }  
    }
    
    return []
  }
}