import { directions, PlayerTurnRule } from '@gamepark/rules-api'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { TreesHelper } from './helpers/TreesHelper'
import { MaterialType } from '../material/MaterialType'
import { Tree, treeProperties } from '../material/Tree'

export class CheckTreeBonusActionRule extends PlayerTurnRule {
  onRuleStart() {
    const lastTreeId = this.remind(Memory.PlantedTrees).at(-1)
    const lastTree = this.material(MaterialType.TreeCard).id(lastTreeId).getItem()!
    const treesHelper = new TreesHelper(this.game, this.player)
    
    const bonuses = []
    for (const direction of directions) {
      if (treesHelper.hasTreeBonusInDirection(lastTree, direction)) {
        bonuses.push(treeProperties[lastTreeId as Tree]?.bonus.element)
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