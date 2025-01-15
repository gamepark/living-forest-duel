import { MaterialMove } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { elements } from '../Season'
import { ActionRule } from './ActionRule'

export class RevealTreesRule extends ActionRule {

  onRuleStart() {
    const moves: MaterialMove[] = []
    for (const element of elements) {
      const topTree = this.material(MaterialType.TreeCard).location(l => l.id === element).maxBy(item => item.location.x!)
      if (topTree.getItem()?.location.rotation) {
        moves.push(topTree.rotateItem(false))
      }
    }
    moves.push(this.endAction())
    return moves
  }
}