import { useEffect } from 'react'
import styled from 'styled-components'

import ReviewImport, { StyledButtonContainer } from './ReviewImport'

import useImportFile from './useImportFile'

import Button from '@l3-lib/ui-core/dist/Button'
import UploadButton from 'components/UploadButton'
import { ButtonTertiary } from 'components/Button/Button'
import { useDownloadTemplate } from './useDownloadTemplate'

import { t } from 'i18next'

const ImportFile = ({ setFieldValue, value = '' }: { setFieldValue: any; value?: string }) => {
  const {
    step,
    parsedData,
    setParsedData,
    setStep,
    handleFileFormat,
    handleConvertJson,
    handleConvertCSVtoJSON,

    fileIsLoading,
  } = useImportFile({
    setFieldValue: setFieldValue,
  })

  const { handleDownloadTemplate, handleDownloadTemplateCSV } = useDownloadTemplate()

  useEffect(() => {
    if (value.length > 0) {
      const fileUrl = value

      fetch(fileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
          }
          return response.text()
        })
        .then(data => {
          if (fileUrl.endsWith('.json')) {
            const { data: convertedData } = handleConvertJson(data)
            setParsedData(convertedData)
          } else if (fileUrl.endsWith('.csv')) {
            const { data: convertedData } = handleConvertCSVtoJSON(data)
            setParsedData(convertedData)
          }
          setStep(1)
        })
        .catch(error => {
          console.error('Error fetching file:', error)
        })
    }
  }, [value])

  function renderTabs(tabIndex: number) {
    switch (tabIndex) {
      case 0:
        return (
          <StyledButtonContainer>
            <ButtonTertiary onClick={handleDownloadTemplate} size={Button.sizes.SMALL}>
              {t('download-template json')}
            </ButtonTertiary>
            <ButtonTertiary onClick={handleDownloadTemplateCSV} size={Button.sizes.SMALL}>
              {t('download-template csv')}
            </ButtonTertiary>

            <UploadButton
              onChange={handleFileFormat}
              isLoading={fileIsLoading}
              label={t('upload-file')}
            />
          </StyledButtonContainer>
        )

      case 1:
        return (
          <>
            <ReviewImport data={parsedData} setStep={setStep} />
          </>
        )

      default:
        return <>Error..!</>
    }
  }

  return (
    <>
      <StyledFormSection>{renderTabs(step)}</StyledFormSection>
    </>
  )
}

export default ImportFile

export const StyledFormSection = styled.div<{ columns?: string }>`
  width: 100%;
  height: 100%;
`
