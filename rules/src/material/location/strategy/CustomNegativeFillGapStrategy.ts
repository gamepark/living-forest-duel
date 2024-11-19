import { LocationStrategy, Material, MaterialItem } from "@gamepark/rules-api"

/**
 * This strategy is a custom implementation of the FillGapStrategy very specific for Living Forest Duel, where we have positions from -3 to 3
 * It could probably be extended to something generic
 */
export class CustomNegativeFillGapStrategy<P extends number = number, M extends number = number, L extends number = number> implements LocationStrategy<P, M, L> {
  axis: 'x' | 'y' | 'z'

  constructor(axis: 'x' | 'y' | 'z' = 'x') {
    this.axis = axis
  }

  addItem(material: Material<P, M, L>, item: MaterialItem<P, L>): void {
    if (item.location[this.axis] === undefined) {
      const items = material.sort(item => item.location[this.axis]!).getItems()
      let position = 0
      let axis = -3
      while (items[position]?.location[this.axis] === axis) {
        position++
        axis++
      }
      item.location[this.axis] = axis
    }
  }
}