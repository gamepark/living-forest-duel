/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const OnibiBonusActionHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.onibi-bonus-action')}</>
}
