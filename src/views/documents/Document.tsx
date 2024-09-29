/* eslint-disable jsx-a11y/alt-text */
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
} from '@coreui/react-pro'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DocumentsApi from './Documents.Api'
import { RenderPageProps, Viewer, Worker } from '@react-pdf-viewer/core'
import printJS from 'print-js'

const CustomPageLayer: React.FC<{
  renderPageProps: RenderPageProps
}> = ({ renderPageProps }) => {
  React.useEffect(() => {
    if (renderPageProps.canvasLayerRendered) {
      renderPageProps.markRendered(renderPageProps.pageIndex)
    }
  }, [renderPageProps.canvasLayerRendered])

  return (
    <>
      {renderPageProps.canvasLayer.children}
      {renderPageProps.annotationLayer.children}
    </>
  )
}

const renderPdfPage = (props: RenderPageProps) => (
  <CustomPageLayer renderPageProps={props} />
)

const Document = (): JSX.Element => {
  const navigate = useNavigate()
  const [showPicture, setShowPicture] = useState<any>({})
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const docName = searchParams.get('name')

  const getDocumentsShow = (id: any) => {
    DocumentsApi.getImageById(id).then((result: any) => {
      setShowPicture(result.data)
    })
  }

  useEffect(() => {
    getDocumentsShow(id)
  }, [id])

  const handleClickDownloadOrPrintPdf =
    (isPrint = false) =>
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      const pdfUrl = showPicture?.file?.url

      if (!pdfUrl) {
        console.error('URL документа не найден')
        return
      }

      if (isPrint) {
        // Если нужно печатать, используем printJS для печати PDF
        printJS({ printable: pdfUrl, type: 'pdf', showModal: true })
      } else {
        // Если нужно скачать PDF
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = 'document.pdf' // Замените на нужное имя файла
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // Удаляем ссылку после клика
      }
    }

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="px-4">
          <div>{docName}</div>
        </CCardHeader>
        <CCardBody>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1>{docName}</h1>{' '}
          </div>

          <div
            className="mt-2"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {showPicture?.file?.url ? (
              <>
                {showPicture?.file?.url.includes('.pdf') ? (
                  <div
                    className="pdf-viewer"
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                      // height: '490px',
                      width: '100%',
                    }}
                  >
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={showPicture?.file?.url}
                        renderPage={renderPdfPage}
                        withCredentials={true}
                      />
                    </Worker>
                  </div>
                ) : (
                  <div>
                    <img
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                      src={showPicture?.file?.url}
                    />
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </div>

          <div
            style={{
              marginTop: '20px',
            }}
            className={'d-grid gap-2 d-md-flex justify-content-md-end'}
          >
            <CButton onClick={handleClickDownloadOrPrintPdf(true)}>
              Печать
            </CButton>
            <CButton onClick={handleClickDownloadOrPrintPdf(false)}>
              Скачать
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Document
