/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const BonusActionHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.bonus-header')}</>
}
