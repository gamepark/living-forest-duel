import { directions, isMoveItemType, ItemMove, Location, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { TreesHelper } from './helpers/TreesHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { MaterialType } from '../material/MaterialType'
import { LocationType } from '../material/LocationType'
import { getTreeType, Tree, treeProperties } from '../material/Tree'
import { range } from 'lodash'

export class PlantingProtectiveTreeRule extends PlayerTurnRule {
  elementValue = !this.remind(Memory.BonusAction) ? this.remind(Memory.RemainingElementValue) : this.remind(Memory.RemainingBonusElementValue)

  onRuleStart() {
    // if (this.getPlayerMoves().length === 0) {
    if (!new TreesHelper(this.game,this.player).canTreesBePlanted(this.elementValue)) {
      return [this.startRule(RuleId.CheckEndTurn)]
    }

    this.memorize(Memory.RemainingBonuses, [])
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const treesHelper = new TreesHelper(this.game, this.player)
    const availableTrees = treesHelper.getVisibleTreesInStack(this.elementValue)
    const availableSpaces: Location[] = treesHelper.availableSpaces

    for (const tree of availableTrees.getItems()) {
      const availableSpacesForTree = new TreesHelper(this.game, this.player).getAvailableSpacesForTree(tree, availableSpaces)
      moves.push(
        ...availableSpacesForTree.flatMap((space) => {
          return [
            ...availableTrees.id(tree.id).moveItems(space)
          ]
        })
      )
    }

    return moves
  }

  afterItemMove(move: ItemMove<number, number, number>) {
    if (isMoveItemType(MaterialType.TreeCard)(move) && move.location.type === LocationType.PlayerForest) {
      const movedCard = this.material(move.itemType).getItem(move.itemIndex)

      // Check winning condition
      if (this.isPlantWinningCondition()) {
        return [this.startRule(RuleId.EndGame)]
      } else {
        // Remember the types planted because we can only take one of each type
        const plantedTreesTypes = this.remind(Memory.PlantedTreesTypes)
        plantedTreesTypes.push(getTreeType(movedCard.id))
        this.memorize(Memory.PlantedTreesTypes, plantedTreesTypes)

        // Update remaining value
        this.memorize(Memory.RemainingElementValue, this.elementValue - treeProperties[movedCard!.id as Tree]!.cost)

        // Check possible bonuses
        const treesHelper = new TreesHelper(this.game, this.player)
        const bonuses = []
        for (const direction of directions) {
          if (treesHelper.hasBonusInDirection(movedCard, direction)) {
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
    }

    return []
  }

  isPlantWinningCondition() {
    const trees = this.material(MaterialType.TreeCard).location(LocationType.PlayerForest).id(this.player).getItems()
    if (trees.length < 9) {  // Not enough for a 3x3 matrix
      return false
    }

    // Matrix limits
    const xMin = Math.min(...trees.map(x => x.location.x!))
    const xMax = Math.max(...trees.map(x => x.location.x!))
    const yMin = Math.min(...trees.map(y => y.location.y!))
    const yMax = Math.max(...trees.map(y => y.location.y!))

    // Container matrix
    const rows = yMax - yMin + 1
    const cols = xMax - xMin + 1
    const matrix: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))

    trees.forEach(({ location }) => {
      matrix[location.y! - yMin][location.x! - xMin] = true
    })

    return matrix.some((_, row) =>
      row <= rows - 3 && matrix[row].some((_, col) =>
        col <= cols - 3 && range(0, 3).every(i =>
          range(0, 3).every(j => matrix[row + i][col + j])
        )
      )
    )
  }

}