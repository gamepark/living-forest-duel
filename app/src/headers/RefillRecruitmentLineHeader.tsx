/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const RefillRecruitmentLineHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.refill-recruitment-line')}</>
}
