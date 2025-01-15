/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const RevealTreesHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.reveal-trees')}</>
}
