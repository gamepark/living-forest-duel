import { CustomMove, directions, isMoveItemType, ItemMove, Location, MaterialMove } from '@gamepark/rules-api'
import { range, sumBy } from 'lodash'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getTreeElement, Tree, treeProperties } from '../material/Tree'
import { Element } from '../Season'
import { ActionRule } from './ActionRule'
import { Action, elementActionRule, PlantingProtectiveTrees } from './actions/Action'
import { CustomMoveType } from './CustomMoveType'
import { ElementsHelper } from './helpers/ElementsHelper'
import { SankiHelper } from './helpers/SankiHelper'
import { TreesHelper } from './helpers/TreesHelper'
import { Memory } from './Memory'

export class PlantingProtectiveTreeRule extends ActionRule<PlantingProtectiveTrees> {

  onRuleStart() {
    if (!new TreesHelper(this.game).canTreesBePlanted(this.action.value)) {
      return [this.endAction()]
    }
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const treesHelper = new TreesHelper(this.game)
    const availableTrees = treesHelper.getVisibleTreesInStack(this.action.value, this.action.plantedTreesElements)
    const availableSpaces: Location[] = treesHelper.availableSpaces

    for (const tree of availableTrees.getItems()) {
      const availableSpacesForTree = new TreesHelper(this.game).getAvailableSpacesForTree(tree, availableSpaces)
      moves.push(
        ...availableSpacesForTree.flatMap((space) => {
          return [
            ...availableTrees.id(tree.id).moveItems(space)
          ]
        })
      )
    }

    // Only can pass if at least one tree was planted
    const elementsHelper = new ElementsHelper(this.game)
    if (this.action.value < elementsHelper.getElementValue(Element.Plant, !this.isBonusAction)) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }

    return moves
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
      return [this.endAction()]
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.TreeCard)(move) && move.location.type === LocationType.PlayerForest) {
      const movedCard = this.material(move.itemType).getItem<Tree>(move.itemIndex)

      // Check winning condition
      if (this.isPlantWinningCondition()) {
        return [this.endGame()]
      } else {
        const tree = movedCard.id
        // Remember the types planted because we can only take one of each type
        this.action.plantedTreesElements.push(getTreeElement(tree)!)

        // Update remaining value
        this.action.value -= treeProperties[tree]!.cost

        // Check possible bonuses
        const bonus = treeProperties[tree]!.bonus.element
        const treesHelper = new TreesHelper(this.game)
        const bonusCount = sumBy(directions, direction =>
          treesHelper.hasBonusInDirection(movedCard, direction) ? 1 : 0
        )
        if (bonusCount > 0) {
          if (bonus === Element.Wind) {
            return new SankiHelper(this.game).takeSankiCards(bonusCount)
          } else {
            const value = new ElementsHelper(this.game).getElementValue(bonus)
            for (let i = 0; i < bonusCount; i++) {
              const action: Action = bonus === Element.Plant ?
                { element: bonus, value, plantedTreesElements: [], bonus: true }
                : { element: bonus, value, bonus: true }
              this.remind<Action[]>(Memory.PendingActions).push(action)
            }
            return [this.startRule(elementActionRule[bonus])]
          }
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