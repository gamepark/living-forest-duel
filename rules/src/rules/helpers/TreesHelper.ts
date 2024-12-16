import { Direction, directions, getSquareInDirection, Location, Material, MaterialGame, MaterialItem, MaterialRulesPart, XYCoordinates } from "@gamepark/rules-api";
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
    const playedCards = this.panorama.getItems()
    for (const playedCard of playedCards) {
      const coordinates = { x: playedCard.location.x, y: playedCard.location.y }

      // It's possible to put a card on top, excepting the starting tree
      if (coordinates.x !== 0 || coordinates.y !== 0) {
        availableSpaces.push({ type: LocationType.PlayerForest, player: this.player, x: playedCard.location.x, y: playedCard.location.y })
      }

      const left = { x: playedCard.location.x! - 1, y: playedCard.location.y! }
      if (!playedCards.find(item => isAnyCardToTheLeft(item, coordinates))) {
        availableSpaces.push({ type: LocationType.PlayerForest, player: this.player, x: left.x, y: left.y })
      }

      const right = { x: playedCard.location.x! + 1, y: playedCard.location.y! }
      if (!playedCards.find(item => isAnyCardToTheRight(item, coordinates))) {
        availableSpaces.push({ type: LocationType.PlayerForest, player: this.player, x: right.x, y: right.y })
      }

      const below = { x: playedCard.location.x!, y: playedCard.location.y! + 1 }
      if (!playedCards.find(item => isAnyCardBelow(item, coordinates))) {
        availableSpaces.push({ type: LocationType.PlayerForest, player: this.player, x: below.x, y: below.y })
      }

      const above = { x: playedCard.location.x!, y: playedCard.location.y! - 1 }
      if (!playedCards.find(item => isAnyCardAbove(item, coordinates))) {
        availableSpaces.push({ type: LocationType.PlayerForest, player: this.player, x: above.x, y: above.y })
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
      .location(l => l.type === LocationType.PlayerForest && l.player === this.player)
  }

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
    let neighborSpace: XYCoordinates = { x: 0, y: 0 }

    // North
    neighborSpace = { x: space.x!, y: space.y! - 1 }
    if (this.hasValidNeighborCard(treeId, space, Direction.North, neighborSpace, Direction.South)) {
      return true
    }
    // East
    neighborSpace = { x: space.x! + 1, y: space.y! }
    if (this.hasValidNeighborCard(treeId, space, Direction.East, neighborSpace, Direction.West)) {
      return true
    }
    // South
    neighborSpace = { x: space.x!, y: space.y! + 1 }
    if (this.hasValidNeighborCard(treeId, space, Direction.South, neighborSpace, Direction.North)) {
      return true
    }
    // West
    neighborSpace = { x: space.x! - 1, y: space.y! }
    if (this.hasValidNeighborCard(treeId, space, Direction.West, neighborSpace, Direction.East)) {
      return true
    }

    return false
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

  hasValidNeighborCard(treeId: Tree, treePos: Location, treeDirection: Direction, neighborPos: XYCoordinates, neighborDirection: Direction) {
    // There can be more than one neighbor tree as they could be piled. We need to consider only the top one
    const neighborTree = this.showVisibleTree(neighborPos)
    if (neighborTree.getItems().length === 0) { // No neighbor
      return false
    } else if (this.hasRiverInDirection(treeId, treeDirection)
      && (this.isLake(neighborTree)
        || (this.hasRiverInDirection(neighborTree.getItem()?.id, neighborDirection) && this.canReachLake(treeId, treePos)))) {
      return true
    }

    return false
  }

  canReachLake(treeId: Tree, treePos: Location): boolean {
    const initialCoordinates = { x: treePos.x!, y: treePos.y! }
    const queue: XYCoordinates[] = [initialCoordinates];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const position = queue.shift()!;
      const positionKey = `${position.x},${position.y}`;

      if (visited.has(positionKey)) continue;
      visited.add(positionKey);

      const currentTree = position !== initialCoordinates ? this.showVisibleTree(position) : this.material(MaterialType.TreeCard).id(treeId);
      if (!currentTree.getItem()) continue;

      for (const dir of directions) {
        const currentLocation = position !== initialCoordinates ? currentTree.getItem()!.location : treePos;
        const neighborPos = getSquareInDirection(currentLocation, dir);
        const neighborKey = `${neighborPos.x},${neighborPos.y}`;

        if (!visited.has(neighborKey)) {
          const neighbor = this.showVisibleTree(neighborPos);
          if (neighbor.getItem()) {
            if (this.isLake(neighbor)) {
              return true;
            } else if (treeProperties[neighbor.getItem()!.id as Tree]?.bonus.river[dir]) {
              queue.push(neighborPos);
            }
          }
        }
      }
    }

    return false;
  }

  isLake(tree: Material) {
    return tree.id(this.player).getItem() !== undefined
  }

  hasRiverInDirection(treeId: Tree, direction: Direction) {
    return treeProperties[treeId]?.bonus.river[direction]!
  }

  hasBonusInDirection(tree: MaterialItem, direction: Direction) {
    const neighborDelta = { x: CardinalLocations[direction].x, y: CardinalLocations[direction].y }
    // There can be more than one neighbor tree as they could be piled. We need to consider only the top one
    const neighbor = this.showVisibleTree({ x: tree.location.x! + neighborDelta.x, y: tree.location.y! + neighborDelta.y }).getItem()
    return neighbor !== undefined && treeProperties[tree.id as Tree]?.bonus.element === treeProperties[neighbor.id as Tree]?.bonus.element
  }

}

export const oppositeDirection = (direction: Direction) => {
  switch (direction) {
    case Direction.North:
      return Direction.South
    case Direction.South:
      return Direction.North
    case Direction.East:
      return Direction.West
    case Direction.West:
      return Direction.East
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