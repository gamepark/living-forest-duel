/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { getTreeElement, isStartingTree, Tree, treeProperties } from '@gamepark/living-forest-duel/material/Tree'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'
import Plant from '../../images/icons/Plant.png'
import { elementIcon } from '../AnimalCardDescription'
import { getBonusLabel } from './ClearingCardHelp'

export const TreeCardHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const tree = item.id?.front as Tree
  if (isStartingTree(tree)) return <StartingTree/>
  if (tree === undefined) return <h2>{t('tree')}</h2>
  const properties = treeProperties[tree]!
  return <>
    <h2>{t('tree')}</h2>
    <p>
      <Trans defaults="tree.cost" values={{ cost: properties.cost }} components={{
        plant: <Picture css={iconCss} src={Plant}/>
      }}/>
    </p>
    <p>
      <Trans defaults="tree.element" components={{
        element: <Picture css={iconCss} src={elementIcon[getTreeElement(tree)!]}/>
      }}/>
    </p>
    <p>{t('bonus', { bonus: getBonusLabel(properties.bonus, t) })}</p>
    <p>
      <Trans defaults="tree.rule" components={{
        bold: <strong/>
      }}/>
    </p>
    <p><strong>{t('tree.win')}</strong></p>
  </>
}

const StartingTree = () => {
  const { t } = useTranslation()
  return <>
    <h2>{t('tree.starting')}</h2>
    <p>{t('tree.starting.rule')}</p>
  </>
}

const iconCss = css`
  vertical-align: sub;
  height: 1.2em;
`
