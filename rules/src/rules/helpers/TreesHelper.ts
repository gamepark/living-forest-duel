import { Direction, directions, getSquareInDirection, Material, MaterialGame, MaterialItem, MaterialRulesPart, XYCoordinates } from '@gamepark/rules-api'
import { cloneDeep, range } from 'lodash'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { getTreeElement, isStartingTree, Tree, treeProperties } from '../../material/Tree'
import { CardinalLocations, Element, Season } from '../../Season'

export class TreesHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player: Season = game.rule!.player!) {
    super(game)
  }

  getCurrentForest() {
    const { xMin, xMax, yMin, yMax } = this.boundaries
    const forest: Forest = range(0, yMax - yMin + 3).map(_ => range(0, xMax - xMin + 3).map(_ => undefined))
    const trees = this.material(MaterialType.TreeCard).location(LocationType.PlayerForest).player(this.player).sort(item => item.location.z!).getItems<Tree>()
    for (const tree of trees) {
      forest[tree.location.y! - yMin + 1][tree.location.x! - xMin + 1] = tree.id
    }
    return forest
  }

  getVisibleTreesInStack(plantValue: number, plantedTreesElements: Element[] = []): Material {
    const treesInDecks = this.material(MaterialType.TreeCard).location(LocationType.TreeDeckSpot)
    const items = treesInDecks.getItems()
    return treesInDecks
      .location(l => !items.some(item => item.location.id === l.id && item.location.x! > l.x!))
      .id<Tree>(tree => !plantedTreesElements.includes(getTreeElement(tree)!) && treeProperties[tree]!.cost <= plantValue)
  }

  canTreesBePlanted(plantValue: number) {
    const availableTrees = this.getVisibleTreesInStack(plantValue).getItems<Tree>()
    return availableTrees.some(tree => this.getAvailableSpacesForTree(tree.id).length > 0)
  }

  get boundaries() {
    const panorama = this.panorama
    return {
      xMin: panorama.minBy((item) => item.location.x!).getItem()?.location?.x ?? 0,
      xMax: panorama.maxBy((item) => item.location.x!).getItem()?.location?.x ?? 0,
      yMin: panorama.minBy((item) => item.location.y!).getItem()?.location?.y ?? 0,
      yMax: panorama.maxBy((item) => item.location.y!).getItem()?.location?.y ?? 0
    }
  }

  get panorama() {
    return this
      .material(MaterialType.TreeCard)
      .location(l => l.type === LocationType.PlayerForest && l.player === this.player)
  }

  getAvailableSpacesForTree(tree: Tree) {
    const { xMin, yMin } = this.boundaries
    const forest = this.getCurrentForest()
    const spaces: XYCoordinates[] = []
    for (let y = 0; y < forest.length; y++) {
      for (let x = 0; x < forest[0].length; x++) {
        const forestClone = cloneDeep(forest)
        forestClone[y][x] = tree
        if (isValidForest(forestClone)) {
          spaces.push({ x: x + xMin - 1, y: y + yMin - 1 })
        }
      }
    }
    return spaces
  }

  showVisibleTree(reference: { x?: number; y?: number }) {
    const treesInLocation = this.material(MaterialType.TreeCard)
      .location(l => l.type === LocationType.PlayerForest
        && l.player === this.player
        && l.x === reference.x!
        && l.y === reference.y!)
    const items = treesInLocation.getItems()
    return treesInLocation.location(l => !items.some(item => item.location.x === l.x && item.location.y === l.y && item.location.z! > l.z!))
  }

  hasBonusInDirection(tree: MaterialItem, direction: Direction) {
    const neighborDelta = { x: CardinalLocations[direction].x, y: CardinalLocations[direction].y }
    // There can be more than one neighbor tree as they could be piled. We need to consider only the top one
    const neighbor = this.showVisibleTree({ x: tree.location.x! + neighborDelta.x, y: tree.location.y! + neighborDelta.y }).getItem()
    return neighbor !== undefined && treeProperties[tree.id as Tree]?.bonus.element === treeProperties[neighbor.id as Tree]?.bonus.element
  }
}

export type Forest = (Tree | undefined)[][]

const oppositeDirection = (direction: Direction): Direction => direction % 2 === 0 ? direction - 1 : direction + 1

export function isValidForest(forest: Forest) {
  const pathfinding = forest.map(line => line.map(tree => tree === undefined))
  const lakeY = forest.findIndex(line => line.some(isStartingTree))
  if (lakeY === -1) return false
  const lakeX = forest[lakeY].findIndex(isStartingTree)
  pathfinding[lakeY][lakeX] = true
  const spacesToCheck: XYCoordinates[] = []
  for (const direction of directions) {
    const { x, y } = getSquareInDirection({ x: lakeX, y: lakeY }, direction)
    if (0 <= y && y < forest.length && 0 <= x && x < forest[0].length) {
      const tree = forest[y][x]
      if (tree !== undefined && treeProperties[tree]!.bonus.river[oppositeDirection(direction)]) {
        pathfinding[y][x] = true
        spacesToCheck.push({ x, y })
      }
    }
  }
  while (spacesToCheck.length > 0) {
    const space = spacesToCheck.pop()!
    const connectedTree = forest[space.y][space.x]!
    for (const direction of directions) {
      const { x, y } = getSquareInDirection(space, direction)
      if (0 <= y && y < forest.length && 0 <= x && x < forest[0].length) {
        const tree = forest[y][x]
        if (tree !== undefined && !pathfinding[y][x]
          && treeProperties[connectedTree]!.bonus.river[direction]
          && treeProperties[tree]!.bonus.river[oppositeDirection(direction)]) {
          pathfinding[y][x] = true
          spacesToCheck.push({ x, y })
        }
      }
    }
  }
  return pathfinding.every(line => !line.includes(false))
}
