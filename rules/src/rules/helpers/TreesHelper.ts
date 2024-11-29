import { Direction, Location, Material, MaterialGame, MaterialItem, MaterialRulesPart } from "@gamepark/rules-api";
import { minBy, uniqBy } from "lodash";
import { MaterialType } from "../../material/MaterialType";
import { LocationType } from "../../material/LocationType";
import { getTreeType, Tree, TreePattern, treeProperties } from "../../material/Tree";
import { Memory } from "../Memory";
import { CardinalLocations } from "../../Season";

export class TreesHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
  }

  getVisibleTreesInStack(plantValue: number): Material {
    const treesInDecks = this.material(MaterialType.TreeCard).location(LocationType.TreeDeckSpot)
    const items = treesInDecks.getItems()
    return treesInDecks
      .location(l => !items.some(item => item.location.id === l.id && item.location.x! > l.x!))
      .filter(tree => !this.remind(Memory.PlantedTreesTypes).includes(getTreeType(tree.id)) && treeProperties[tree.id as Tree]?.cost! <= plantValue)
      // .filter(tree => !this.remind(Memory.PlantedTreesTypes).includes(getTreeType(tree.id)) && treeProperties[tree.id as Tree]?.cost! <= this.remind(Memory.RemainingElementValue))
  }

  getTreesMinCost(treesIds: number[]) {
    return this.getMinCostElement(this.getTreesProperties(treesIds))?.cost
  }

  getTreesProperties(treesIds: number[]) {
    const filteredProperties = Object.keys(treeProperties).reduce((acc, key) => {
      if (treesIds.includes(Number(key))) {
        acc[key] = treeProperties[Number(key) as Tree]
      }
      return acc
    }, {} as Record<string, any>)

    return filteredProperties
  }

  getMinCostElement(properties: Partial<Record<Tree, TreePattern>>) {
    return minBy(Object.values(properties), 'cost')
  }

  canTreesBePlanted(plantValue: number) {
    let canPlant = false
    const availableTrees = this.getVisibleTreesInStack(plantValue)
    const availableSpaces: Location[] = this.availableSpaces

    for (const tree of availableTrees.getItems()) {
      const availableSpacesForTree = new TreesHelper(this.game, this.player).getAvailableSpacesForTree(tree, availableSpaces)
      if (availableSpacesForTree.length > 0) {
        canPlant = true
        break
      }
    }

    return canPlant
  }

  get availableSpaces() {

    const availableSpaces: Location[] = []
    const boundaries = this.boundaries
    const playedCards = this.panorama.getItems()

    for (const playedCard of playedCards) {
      const coordinates = { x: playedCard.location.x, y: playedCard.location.y }

      // It's possible to put a card on top, excepting the starting tree
      if (coordinates.x !== 0 || coordinates.y !== 0) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: playedCard.location.x, y: playedCard.location.y })
      }

      const left = { x: playedCard.location.x! - 1, y: playedCard.location.y! }
      if (!playedCards.find(item => isAnyCardToTheLeft(item, coordinates)) && (boundaries.xMax - left.x < 3)) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: left.x, y: left.y })
      }

      const right = { x: playedCard.location.x! + 1, y: playedCard.location.y! }
      if (!playedCards.find(item => isAnyCardToTheRight(item, coordinates)) && (right.x - boundaries.xMin < 3)) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: right.x, y: right.y })
      }

      const below = { x: playedCard.location.x!, y: playedCard.location.y! + 1 }
      if (!playedCards.find(item => isAnyCardBelow(item, coordinates)) && (below.y - boundaries.yMin < 3)) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: below.x, y: below.y })
      }

      const above = { x: playedCard.location.x!, y: playedCard.location.y! - 1 }
      if (!playedCards.find(item => isAnyCardAbove(item, coordinates)) && (boundaries.yMax - above.y < 3)) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: above.x, y: above.y })
      }
    }

    return uniqBy(availableSpaces, (location) => JSON.stringify(location))

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
      .location(l => l.type === LocationType.PlayerForest && l.id === this.player)
  }

  // TODO: Modify this to consider only the top card
  getAvailableSpacesForTree(tree: MaterialItem, spaces: Location[]) {
    const treeSpaces: Location[] = []
    for (const space of spaces) {
      if (this.checkNeighbors(tree.id, space)) {
        treeSpaces.push(space)
      }
    }

    return treeSpaces
  }

  checkNeighbors(treeId: Tree, space: Location) {
    let neighborSpace = {}

    // North
    neighborSpace = { x: space.x, y: space.y! - 1 }
    if (this.hasValidNeighborCard(neighborSpace, treeProperties[treeId]?.bonus.river[Direction.North]!, Direction.South)) {
      return true
    }
    // East
    neighborSpace = { x: space.x! + 1, y: space.y! }
    if (this.hasValidNeighborCard(neighborSpace, treeProperties[treeId]?.bonus.river[Direction.East]!, Direction.West)) {
      return true
    }
    // South
    neighborSpace = { x: space.x, y: space.y! + 1 }
    if (this.hasValidNeighborCard(neighborSpace, treeProperties[treeId]?.bonus.river[Direction.South]!, Direction.North)) {
      return true
    }
    // West
    neighborSpace = { x: space.x! - 1, y: space.y }
    if (this.hasValidNeighborCard(neighborSpace, treeProperties[treeId]?.bonus.river[Direction.West]!, Direction.East)) {
      return true
    }

    return false
  }

  // This algorithm only works while the river in the card is always conected.
  // It would not work if we introduce a card that, for example, has a river connecting N-E and a separate one connecting S-W
  // TODO: Update this to consider only the top card of each neighbor
  hasValidNeighborCard(reference: { x?: number; y?: number }, treeHasRiver: boolean, direction: Direction) {
    const neighborTree = this.material(MaterialType.TreeCard)
      .location(l => l.type === LocationType.PlayerForest
        && l.id === this.player
        && l.x === reference.x!
        && l.y === reference.y!)

    // if (neighborTree.getItems().length === 0 // No neighbor
    //   || (treeHasRiver && (neighborTree.id(this.player).getItem() !== undefined || treeProperties[neighborTree.getItem()!.id! as Tree]?.bonus.river[direction]))) {
    if (neighborTree.getItems().length === 0) { // No neighbor
      return false
    }else if (treeHasRiver && (neighborTree.id(this.player).getItem() !== undefined || treeProperties[neighborTree.getItem()!.id! as Tree]?.bonus.river[direction])) {
      return true
    }

    return false
  }

  hasBonusInDirection(tree: MaterialItem, direction: Direction) {
    const neighborDelta = { x: CardinalLocations[direction].x, y: CardinalLocations[direction].y }
    const neighbor = this.material(MaterialType.TreeCard)
      .location(l => l.type === LocationType.PlayerForest && l.id === this.player && l.x === tree.location.x! + neighborDelta.x && l.y === tree.location.y! + neighborDelta.y)
      .getItem()

    return neighbor !== undefined && treeProperties[tree.id as Tree]?.bonus.element === treeProperties[neighbor.id as Tree]?.bonus.element
  }

}


export const isAnyCardToTheLeft = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! - 1 && slotToCheck.location.y === reference.y
}
export const isAnyCardToTheRight = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! + 1 && slotToCheck.location.y === reference.y
}
export const isAnyCardAbove = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! && slotToCheck.location.y === reference.y! - 1
}
export const isAnyCardBelow = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! && slotToCheck.location.y === reference.y! + 1
}