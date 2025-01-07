/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { SpiritType } from '@gamepark/living-forest-duel/material/SpiritType'
import { linkButtonCss, Picture, PlayMoveButton } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'
import Water from '../../images/icons/Water.png'
import Wind from '../../images/icons/Wind.png'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const OnibiStandeeHelp = () => {
  const { t } = useTranslation()
  return <>
    <h2>{t('onibi')}</h2>
    <p><Trans defaults="onibi.action" components={{
      bold: <strong/>,
      wind: <Picture css={iconCss} src={Wind}/>
    }}/></p>
    <p><Trans defaults="onibi.rule" components={{
      bold: <strong/>,
      card: <PlayMoveButton css={linkButtonCss} move={displayMaterialHelp(MaterialType.SpiritCard, { id: SpiritType.Onibi })} local/>
    }}/></p>
    <h3>{t('end-turn')}</h3>
    <p>{t('end-turn.trigger')}</p>
    <p><Trans defaults="end-turn.varan" components={{
      water: <Picture css={iconCss} src={Water}/>
    }}/></p>
    <p>{t('end-turn.onibi')}</p>
  </>
}

const iconCss = css`
  vertical-align: sub;
  height: 1.2em;
`
