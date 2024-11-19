import { ListLocator } from "@gamepark/react-game"
import { Location } from "@gamepark/rules-api"
import { actionTokenDescription } from "../material/ActionTokenDescription"
import { personalHelpLineLocator } from "./PersonalHelpLineLocator"
import { LocationType } from "@gamepark/living-forest-duel/material/LocationType"
import { treeTokenLocator } from "./TreeTokenLocator"
import { treeTokenDescription } from "../material/TreeTokenDescription"

class PlayerActionSupplyLocator extends ListLocator {
  gap = { x: actionTokenDescription.width + 0.5 }
  
  getCoordinates(location: Location<number, number>) {
    return {
      // x: location.id === Season.Summer ? -36 : 36,
      x: treeTokenLocator.getCoordinates({type: LocationType.TreeToken, id: location.id}).x - treeTokenDescription.width / 2,
      y: personalHelpLineLocator.getCoordinates({type: LocationType.PersonalHelpLine, id: location.id}).y - treeTokenDescription.height / 2
    }
  }
}

export const playerActionSupplyLocator = new PlayerActionSupplyLocator()