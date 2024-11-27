import { ListLocator } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"
import { actionTokenDescription } from "../material/ActionTokenDescription"
import { LocationType } from "@gamepark/living-forest-duel/material/LocationType"
import { treeTokenLocator } from "./TreeTokenLocator"
import { treeTokenDescription } from "../material/TreeTokenDescription"

class PlayerActionLostLocator extends ListLocator {
  gap = { x: actionTokenDescription.width + 0.5 }

  getCoordinates(location: Location<number, number>) {
    return {
      x: treeTokenLocator.getCoordinates({type: LocationType.TreeToken, id: location.id}).x - treeTokenDescription.width / 2,
      y: treeTokenLocator.getCoordinates({type: LocationType.TreeToken, id: location.id}).y + treeTokenDescription.height / 2,
    }
  }
}

export const playerActionLostLocator = new PlayerActionLostLocator()