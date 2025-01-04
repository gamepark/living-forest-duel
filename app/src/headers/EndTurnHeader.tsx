/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const EndTurnHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.end-turn')}</>
}
