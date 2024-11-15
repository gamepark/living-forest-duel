import { CardDescription } from "@gamepark/react-game";
import { Clearing } from '@gamepark/living-forest-duel/material/Clearing'
import ClearingSummer4 from '../images/cards/clearing/ClearingSummer4.jpg'
import ClearingSummer3 from '../images/cards/clearing/ClearingSummer3.jpg'
import ClearingSummer2 from '../images/cards/clearing/ClearingSummer2.jpg'
import ClearingCenter from '../images/cards/clearing/ClearingCenter.jpg'
import ClearingWinter2 from '../images/cards/clearing/ClearingWinter2.jpg'
import ClearingWinter3 from '../images/cards/clearing/ClearingWinter3.jpg'
import ClearingWinter4 from '../images/cards/clearing/ClearingWinter4.jpg'
import { LocationType } from "@gamepark/living-forest-duel/material/LocationType";
import { range } from "lodash";

class ClearingCardDescription extends CardDescription {
  width = 6.3
  height = 8.8
  borderRadius = 0.5

  images = {
    [Clearing.Summer4]: ClearingSummer4,
    [Clearing.Summer3]: ClearingSummer3,
    [Clearing.Summer2]: ClearingSummer2,
    [Clearing.Center]: ClearingCenter,
    [Clearing.Winter2]: ClearingWinter2,
    [Clearing.Winter3]: ClearingWinter3,
    [Clearing.Winter4]: ClearingWinter4
  }

  staticItems = range(-3,4).map(x => ({
    id: x,
    location: {
      type: LocationType.ClearingLine,
      x
    }
  }))
}

export const clearingCardDescription = new ClearingCardDescription()