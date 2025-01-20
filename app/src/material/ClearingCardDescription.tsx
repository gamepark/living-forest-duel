import { faAnglesRight, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Clearing, clearings } from '@gamepark/living-forest-duel/material/Clearing'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { CustomMoveType } from '@gamepark/living-forest-duel/rules/CustomMoveType'
import { Season } from '@gamepark/living-forest-duel/Season'
import { CardDescription, ItemContext, ItemMenuButton } from '@gamepark/react-game'
import { isCustomMoveType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import ClearingCenter from '../images/cards/clearing/ClearingCenter.jpg'
import ClearingSummer2 from '../images/cards/clearing/ClearingSummer2.jpg'
import ClearingSummer3 from '../images/cards/clearing/ClearingSummer3.jpg'
import ClearingSummer4 from '../images/cards/clearing/ClearingSummer4.jpg'
import ClearingWinter2 from '../images/cards/clearing/ClearingWinter2.jpg'
import ClearingWinter3 from '../images/cards/clearing/ClearingWinter3.jpg'
import ClearingWinter4 from '../images/cards/clearing/ClearingWinter4.jpg'
import { ClearingCardHelp } from './help/ClearingCardHelp'

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

  staticItems = clearings.map(x => ({
    id: x,
    location: {
      type: LocationType.ClearingLine,
      x
    }
  }))

  getLocations(item: MaterialItem) {
    return [{ type: LocationType.ClearingCardSpot, x: item.location.x }]
  }

  help = ClearingCardHelp

  getItemMenu(item: MaterialItem, { player, rules }: ItemContext, legalMoves: MaterialMove[]) {
    if (player === undefined) return
    const moveOnibi = legalMoves.filter(isCustomMoveType(CustomMoveType.MoveOnibi))
    if (!moveOnibi.length) return
    const onibiX = rules.material(MaterialType.OnibiStandee).getItem()!.location.x!
    const itemX = item.location.x!
    const cardDistance = positiveModulo(player === Season.Summer ? itemX - onibiX : onibiX - itemX, 7)
    const moveToThisCard = moveOnibi.filter(move => positiveModulo(move.data, 7) === cardDistance)
    if (!moveToThisCard.length) return
    return <>
      {moveToThisCard.map(move =>
        <ItemMenuButton key={move.data} move={move} x={-2} y={-2.5 * Math.floor(move.data / 7) - 3}
                        label={<Trans defaults="button.steps" values={{ steps: move.data }}/>}>
          <FontAwesomeIcon icon={move.data < 7 ? faChevronRight : faAnglesRight}/>
        </ItemMenuButton>
      )}
    </>
  }
}

export const positiveModulo = (n: number, m: number): number => ((n % m) + m) % m

export const clearingCardDescription = new ClearingCardDescription()