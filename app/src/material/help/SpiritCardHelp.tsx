/** @jsxImportSource @emotion/react */
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { SpiritType } from '@gamepark/living-forest-duel/material/SpiritType'
import { linkButtonCss, MaterialHelpProps, PlayMoveButton } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const SpiritCardHelp = (props: MaterialHelpProps) => {
  if (props.item.id === SpiritType.Onibi) {
    return <OnibiCardHelp/>
  } else {
    return <SankiCardHelp {...props}/>
  }
}

const OnibiCardHelp = () => {
  const { t } = useTranslation()
  return <>
    <h2>{t('onibi.card')}</h2>
    <p><Trans defaults="onibi.card.rule" components={{
      bold: <strong/>
    }}/></p>
    <p><Trans defaults="onibi.card.give" components={{
      onibi: <PlayMoveButton css={linkButtonCss} move={displayMaterialHelp(MaterialType.OnibiStandee)} local/>
    }}/></p>
  </>
}

const SankiCardHelp = (_props: MaterialHelpProps) => {
  return null
}

