/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const ActionTokenHelp = () => {
  const { t } = useTranslation()
  return <>
    <h2>{t('action.token')}</h2>
    <p>{t('action.token.rule')}</p>
  </>
}
