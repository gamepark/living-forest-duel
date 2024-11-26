import { Direction, Location, Material, MaterialGame, MaterialItem, MaterialRulesPart } from "@gamepark/rules-api";
import { minBy, uniqBy } from "lodash";
import { MaterialType } from "../../material/MaterialType";
import { LocationType } from "../../material/LocationType";
import { Tree, TreePattern, treeProperties } from "../../material/Tree";
import { Memory } from "../Memory";
import { CardinalLocations } from "../../Season";

export class TreesHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
  }

  getVisibleTreesInStack(): Material {
    const treesInDecks = this.material(MaterialType.TreeCard).location(LocationType.TreeDeckSpot)
    const items = treesInDecks.getItems()
    return treesInDecks
      .location(l => !items.some(item => item.location.id === l.id && item.location.x! > l.x!))
      // .location(l => !this.remind(Memory.PlantedTrees).includes(l.id))
      .filter(tree => !this.remind(Memory.PlantedTrees).includes(tree.location.id) && treeProperties[tree.id as Tree]?.cost! <= this.remind(Memory.RemainingElementValue))
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

  get availableSpaces() {

    const availableSpaces: Location[] = []
    const boundaries = this.boundaries
    const playedCards = this.panorama.getItems()

    playedCards.forEach(playedCard => {
      const coordinates = { x: playedCard.location.x, y: playedCard.location.y }
      const left = { x: playedCard.location.x! - 1, y: playedCard.location.y! }

      // It's possible to put a card on top
      availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: playedCard.location.x, y: playedCard.location.y })

      if (!playedCards.find(item => isAnyCardToTheLeft(item, coordinates)) && (boundaries.xMax - left.x < 3)) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: left.x, y: left.y, z: 0 })
      }

      const right = { x: playedCard.location.x! + 1, y: playedCard.location.y! }
      if (!playedCards.find(item => isAnyCardToTheRight(item, coordinates)) && (right.x - boundaries.xMin < 3)) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: right.x, y: right.y, z: 0 })
      }

      const below = { x: playedCard.location.x!, y: playedCard.location.y! + 1 }
      if (!playedCards.find(item => isAnyCardBelow(item, coordinates)) && (below.y - boundaries.yMin < 3)) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: below.x, y: below.y, z: 0 })
      }

      const above = { x: playedCard.location.x!, y: playedCard.location.y! - 1 }
      if (!playedCards.find(item => isAnyCardAbove(item, coordinates)) && (boundaries.yMax - above.y < 3)) {
        availableSpaces.push({ type: LocationType.PlayerForest, id: this.player, x: above.x, y: above.y, z: 0 })
      }
    })


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
    spaces.forEach(space => {
      if (this.checkNeighbors(tree.id, space)) {
        treeSpaces.push(space)
      }
    })

    return treeSpaces
  }

  checkNeighbors(treeId: Tree, space: Location) {
    let neighborSpace = {}

    // North
    neighborSpace = { x: space.x, y: space.y! - 1 }
    if (!this.hasValidNeighborCard(neighborSpace, treeProperties[treeId]?.bonus.river[Direction.North]!, Direction.South)) {
      return false
    }
    // East
    neighborSpace = { x: space.x! + 1, y: space.y! }
    if (!this.hasValidNeighborCard(neighborSpace, treeProperties[treeId]?.bonus.river[Direction.East]!, Direction.West)) {
      return false
    }
    // South
    neighborSpace = { x: space.x, y: space.y! + 1 }
    if (!this.hasValidNeighborCard(neighborSpace, treeProperties[treeId]?.bonus.river[Direction.South]!, Direction.North)) {
      return false
    }
    // West
    neighborSpace = { x: space.x! - 1, y: space.y }
    if (!this.hasValidNeighborCard(neighborSpace, treeProperties[treeId]?.bonus.river[Direction.West]!, Direction.East)) {
      return false
    }

    return true
  }

  // TODO: Update this to consider only the top card of each neighbor
  hasValidNeighborCard(reference: { x?: number; y?: number }, treeHasRiver: boolean, direction: Direction) {
    const neighborTree = this.material(MaterialType.TreeCard)
      .location(l => l.type === LocationType.PlayerForest
        && l.id === this.player
        && l.x === reference.x!
        && l.y === reference.y!)

    // No neighbor
    if (neighborTree.getQuantity() === 0
      || (treeHasRiver && (neighborTree.id(this.player).getItem() !== undefined || treeProperties[neighborTree.getItem()!.id! as Tree]?.bonus.river[direction]))) {
      return true
    }

    return false
  }

  hasBonusInDirection(tree: MaterialItem, direction: Direction) {
    const neighborDelta = { x: CardinalLocations[direction].x, y: CardinalLocations[direction].y }
    const neighbor = this.material(MaterialType.TreeCard)
      .location(l => l.type === LocationType.PlayerForest && l.id === this.player && l.x === tree.location.x! + neighborDelta.x && l.y === tree.location.y! + neighborDelta.y )
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