import { CustomMove, directions, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { range, sumBy } from 'lodash'
import { Bonus, getBonusElement } from '../material/Bonus'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { TreeId, treeProperties } from '../material/Tree'
import { ActionRule } from './ActionRule'
import { Action, elementActionRule } from './actions/Action'
import { CustomMoveType } from './CustomMoveType'
import { ElementsHelper } from './helpers/ElementsHelper'
import { SankiHelper } from './helpers/SankiHelper'
import { TreesHelper } from './helpers/TreesHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlantingProtectiveTreeRule extends ActionRule {

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const treesHelper = new TreesHelper(this.game)
    const availableTrees = treesHelper.getAvailableTrees(this.action.value)

    for (const [index, tree] of availableTrees.entries) {
      const availableSpacesForTree = new TreesHelper(this.game).getAvailableSpacesForTree(tree.id.front)
      for (const { x, y } of availableSpacesForTree) {
        moves.push(availableTrees.index(index).moveItem({ type: LocationType.PlayerForest, player: this.player, x, y }))
      }
    }

    if (this.canPass()) {
      moves.push(this.customMove(CustomMoveType.Pass))
    }

    return moves
  }

  onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Pass) {
      return [this.startRule(RuleId.RevealTrees)]
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.TreeCard)(move) && move.location.type === LocationType.PlayerForest) {
      const movedCard = this.material(move.itemType).getItem<TreeId>(move.itemIndex)

      // Check winning condition
      if (this.isPlantWinningCondition()) {
        this.memorize(Memory.Winner, this.player)
        return [this.endGame()]
      } else {
        const tree = movedCard.id.front

        // Update remaining value
        this.action.value -= treeProperties[tree]!.cost

        // Check possible bonuses
        const bonus = treeProperties[tree]!.bonus
        const treesHelper = new TreesHelper(this.game)
        const bonusCount = sumBy(directions, direction =>
          treesHelper.hasBonusInDirection(movedCard, direction) ? 1 : 0
        )
        if (bonusCount > 0) {
          if (bonus === Bonus.Sanki) {
            return new SankiHelper(this.game).takeSankiCards(bonusCount)
          } else {
            const element = getBonusElement(bonus)
            const value = new ElementsHelper(this.game).getElementValue(element)
            for (let i = 0; i < bonusCount; i++) {
              this.remind<Action[]>(Memory.PendingActions).push({ element, value, bonus: true })
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