import { CustomMove, directions, isMoveItemType, ItemMove, Location, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { range } from 'lodash'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getTreeType, Tree, treeProperties } from '../material/Tree'
import { Element } from '../Season'
import { CustomMoveType } from './CustomMoveType'
import { ActionType, ElementsHelper } from './helpers/ElementsHelper'
import { TreesHelper } from './helpers/TreesHelper'
import { Memory } from './Memory'
import { PlayerTurnHelper } from './PlayerTurnHelper'
import { RuleId } from './RuleId'

export class PlantingProtectiveTreeRule extends PlayerTurnRule {
  elementsHelper = new ElementsHelper(this.game, this.player)
  elementValue = this.elementsHelper.getRemainingElementValue()

  onRuleStart() {
    if (!new TreesHelper(this.game, this.player).canTreesBePlanted(this.elementValue)) {
      if (!this.elementsHelper.isBonusAction()) {
        return [new PlayerTurnHelper(this.game).endCurrentPlayerTurn()]
      } else {
        this.elementsHelper.removeLastBonusElement()
        return [this.startRule(RuleId.BonusAction)]
      }
    }

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

    // Only can pass if at least one tree was planted
    const lastTokenX = !this.elementsHelper.isBonusAction() ? this.material(MaterialType.ActionToken).location(l => l.type === LocationType.ActionToken && l.y === Element.Plant).getItem()?.location.x : undefined
    if (this.elementValue < this.elementsHelper.getElementValue(Element.Plant, this.player, lastTokenX)) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }

    return moves
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
      return [new PlayerTurnHelper(this.game).endCurrentPlayerTurn()] // TODO: potential bug: might be wrong if inside bonus action
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.TreeCard)(move) && move.location.type === LocationType.PlayerForest) {
      const movedCard = this.material(move.itemType).getItem(move.itemIndex)

      // Check winning condition
      if (this.isPlantWinningCondition()) {
        return [this.endGame()]
      } else {
        // Remember the types planted because we can only take one of each type
        const plantedTreesTypes = this.remind(Memory.PlantedTreesTypes)
        plantedTreesTypes.push(getTreeType(movedCard.id))
        this.memorize(Memory.PlantedTreesTypes, plantedTreesTypes)

        // Update remaining value
        this.elementsHelper.updateRemainingElementValue(this.elementValue - treeProperties[movedCard!.id as Tree]!.cost)

        // Check possible bonuses
        const treesHelper = new TreesHelper(this.game, this.player)
        const bonuses = []
        for (const direction of directions) {
          if (treesHelper.hasBonusInDirection(movedCard, direction)) {
            const bonus: ActionType = { element: treeProperties[movedCard.id as Tree]?.bonus.element!, remainingElementValue: -1 }
            bonuses.push(bonus)
          }
        }

        if (bonuses.length > 0) {
          const remainingBonuses = this.remind(Memory.RemainingBonuses)
          remainingBonuses.push(...bonuses)
          this.memorize(Memory.RemainingBonuses, remainingBonuses)
          return [this.startRule(RuleId.BonusAction)]
        } else {
          return [this.startRule(RuleId.PlantingProtectiveTree)]
        }
      }
    }

    return []
  }

  isPlantWinningCondition() {
    const trees = this.material(MaterialType.TreeCard).location(l => l.type === LocationType.PlayerForest && l.player === this.player).getItems()
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