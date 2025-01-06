/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { Bonus } from '@gamepark/living-forest-duel/material/Bonus'
import { Clearing, clearingProperties } from '@gamepark/living-forest-duel/material/Clearing'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { linkButtonCss, MaterialHelpProps, Picture, PlayMoveButton, useLegalMove, useRules } from '@gamepark/react-game'
import { isMoveItemType, MaterialMoveBuilder } from '@gamepark/rules-api'
import { TFunction } from 'i18next'
import { Trans, useTranslation } from 'react-i18next'
import Water from '../../images/icons/Water.png'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const ClearingCardHelp = ({ item, closeDialog }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const rules = useRules<LivingForestDuelRules>()!
  const clearing = item.id as Clearing
  const properties = clearingProperties[clearing]
  const onibi = rules.material(MaterialType.OnibiStandee)
  const fire = rules.material(MaterialType.FireToken).location(LocationType.ClearingCardSpot).location(l => l.x === clearing)
  const onFire = onibi.getItem()!.location.x === clearing || fire.length > 0
  const extinguish = useLegalMove(move => isMoveItemType(MaterialType.FireToken)(move) && move.itemIndex === fire.getIndex())
  return <>
    <h2>{t('clearing')}</h2>
    <p>{t('fire-value', { fire: properties.fireValue })}</p>
    <p>{t('bonus', { bonus: getBonusLabel(properties.bonus, t) })}</p>
    <p><Trans defaults="clearing.onibi" components={{
      onibi: <PlayMoveButton css={linkButtonCss} move={displayMaterialHelp(MaterialType.OnibiStandee)} local/>
    }}/></p>
    {onFire && <p>{t('clearing.fire')}</p>}
    {fire.length > 0 && <p>
      <Trans defaults="clearing.extinguish" components={{
        extinguish: extinguish ? <PlayMoveButton move={extinguish} onPlay={closeDialog}/> : <strong/>,
        water: <Picture css={iconCss} src={Water}/>
      }}/>
    </p>}
  </>
}

export function getBonusLabel(bonus: Bonus, t: TFunction) {
  switch (bonus) {
    case Bonus.Extinguish:
      return t('bonus.extinguish')
    case Bonus.Recruit:
      return t('bonus.recruit')
    case Bonus.Plant:
      return t('bonus.plant')
    case Bonus.Sanki:
      return t('bonus.sanki')
  }
}

const iconCss = css`
  vertical-align: sub;
  height: 1.2em;
`
