import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { AISummary, Mandala } from '@/types'

/**
 * Generate PDF from AI summary report
 */
export async function generateReportPDF(
  aiSummary: AISummary,
  filename: string = 'mandala-report.pdf'
): Promise<boolean> {
  try {
    // Create temporary HTML element for rendering
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.width = '210mm' // A4 width
    container.style.padding = '20mm'
    container.style.backgroundColor = 'white'
    container.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", "Malgun Gothic", sans-serif'

    // Build HTML content
    container.innerHTML = `
      <div style="color: #1f2937;">
        <!-- Title -->
        <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #111827;">
          만다라트 종합 리포트
        </h1>
        <p style="text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 30px;">
          생성일: ${new Date().toLocaleDateString('ko-KR')}
        </p>

        <!-- Section 1: 회고 요약 -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #111827; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
            1. 회고 요약
          </h2>
          <p style="font-size: 13px; line-height: 1.8; color: #374151; white-space: pre-wrap;">
            ${aiSummary.reflection_summary || '회고 요약이 없습니다.'}
          </p>
        </div>

        <!-- Section 2: 목표 구조 분석 -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #111827; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
            2. 목표 구조 분석
          </h2>
          <p style="font-size: 13px; line-height: 1.8; color: #374151; white-space: pre-wrap;">
            ${aiSummary.goal_analysis || '목표 분석이 없습니다.'}
          </p>
        </div>

        <!-- Section 3: 핵심 키워드 -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #111827; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
            3. 핵심 키워드
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
            ${(aiSummary.keywords || []).map(kw => `
              <span style="background-color: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                ${kw}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Section 4: 통합 인사이트 -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #111827; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
            4. 통합 인사이트
          </h2>
          <p style="font-size: 13px; line-height: 1.8; color: #374151; white-space: pre-wrap;">
            ${aiSummary.insights || '인사이트가 없습니다.'}
          </p>
        </div>
      </div>
    `

    // Append to body temporarily
    document.body.appendChild(container)

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      width: container.offsetWidth,
      windowWidth: container.offsetWidth,
    })

    // Remove temporary element
    document.body.removeChild(container)

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Calculate image dimensions
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * pageWidth) / canvas.width

    // Add image to PDF (split into pages if needed)
    let heightLeft = imgHeight
    let position = 0

    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save PDF
    doc.save(filename)
    return true
  } catch (error) {
    console.error('Error generating report PDF:', error)
    throw error
  }
}

/**
 * Generate PDF from Mandala grid element
 */
export async function generateMandalaPDF(
  element: HTMLElement | null,
  mandala: Mandala,
  filename: string = 'mandala-chart.pdf'
): Promise<boolean> {
  if (!element) {
    throw new Error('Element is required to generate Mandala PDF')
  }

  try {
    // Create a wrapper with title
    const wrapper = document.createElement('div')
    wrapper.style.position = 'absolute'
    wrapper.style.left = '-9999px'
    wrapper.style.backgroundColor = '#ffffff'
    wrapper.style.padding = '30px'
    wrapper.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", "Malgun Gothic", sans-serif'
    wrapper.style.width = '1200px'

    // Add title and center goal
    wrapper.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 32px; font-weight: bold; color: #111827; margin-bottom: 15px;">
          만다라트 9×9 계획서
        </h1>
        <p style="font-size: 18px; color: #374151; font-weight: 500;">
          중심 목표: ${mandala.center_goal || '목표 미설정'}
        </p>
        ${mandala.name ? `<p style="font-size: 16px; color: #6b7280; margin-top: 10px;">이름: ${mandala.name}</p>` : ''}
      </div>
    `

    // Clone the mandala element and append
    const mandalaClone = element.cloneNode(true) as HTMLElement
    wrapper.appendChild(mandalaClone)

    // Add commitment if exists
    if (mandala.commitment) {
      const commitmentDiv = document.createElement('div')
      commitmentDiv.style.marginTop = '20px'
      commitmentDiv.style.padding = '15px'
      commitmentDiv.style.backgroundColor = '#f3f4f6'
      commitmentDiv.style.borderRadius = '8px'
      commitmentDiv.innerHTML = `
        <p style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">다짐</p>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">${mandala.commitment}</p>
      `
      wrapper.appendChild(commitmentDiv)
    }

    // Append to body temporarily
    document.body.appendChild(wrapper)

    // Capture the entire wrapper as canvas
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      width: wrapper.offsetWidth,
    })

    // Remove temporary element
    document.body.removeChild(wrapper)

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    // Create PDF - use landscape if needed
    const doc = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Calculate image dimensions to fit page
    let finalWidth = pageWidth - 20
    let finalHeight = (imgHeight * finalWidth) / imgWidth

    // If height is too large, scale by height instead
    if (finalHeight > pageHeight - 20) {
      finalHeight = pageHeight - 20
      finalWidth = (imgWidth * finalHeight) / imgHeight
    }

    const xPosition = (pageWidth - finalWidth) / 2
    const yPosition = (pageHeight - finalHeight) / 2

    // Add image
    doc.addImage(imgData, 'PNG', xPosition, yPosition, finalWidth, finalHeight)

    // Save PDF
    doc.save(filename)
    return true
  } catch (error) {
    console.error('Error generating Mandala PDF:', error)
    throw error
  }
}
