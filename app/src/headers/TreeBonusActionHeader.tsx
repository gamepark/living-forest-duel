/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const TreeBonusActionHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.tree-bonus-action')}</>
}
