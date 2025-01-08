/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { linkButtonCss, MaterialHelpProps, Picture, PlayMoveButton, useLegalMove, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { isMoveItemType, MaterialMoveBuilder } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'
import Water from '../../images/icons/Water.png'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const FireTokenHelp = ({ item, itemIndex, closeDialog }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const player = usePlayerId()
  const owner = item.location?.player
  const playerName = usePlayerName(owner)
  const take = useLegalMove(move => isMoveItemType(MaterialType.FireToken)(move) && move.itemIndex === itemIndex)
  return <>
    <h2>{t('fire')}</h2>
    {owner !== undefined && <p>{
      player === owner ? t('fire.you', { number: item.quantity ?? 1 })
        : t('fire.player', { player: playerName, number: item.quantity ?? 1 })
    }</p>}
    <p>{t('fire.win')}</p>
    {item.location?.type === LocationType.ClearingCardSpot && <p>
      <Trans defaults="fire.take" components={{
        take: take ? <PlayMoveButton move={take} onPlay={closeDialog}/> : <strong/>,
        water: <Picture css={iconCss} src={Water}/>
      }}/>
    </p>}
    <p><Trans defaults="fire.onibi" components={{
      onibi: <PlayMoveButton css={linkButtonCss} move={displayMaterialHelp(MaterialType.OnibiStandee)} local/>
    }}/></p>
  </>
}

const iconCss = css`
  vertical-align: sub;
  height: 1.2em;
`
