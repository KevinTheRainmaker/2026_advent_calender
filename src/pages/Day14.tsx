import { useState } from 'react'
import { Container, Header } from '@/components/layout'
import { MandalaGrid } from '@/components/mandala'
import { Button, Loading } from '@/components/common'
import { useAuth, useMandala } from '@/hooks'
import { generateAIReport } from '@/services'
import type { AISummary } from '@/types'

export function Day14() {
  const { user } = useAuth()
  const { mandala, isLoading, updateMandala } = useMandala(user?.id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiReport, setAiReport] = useState<AISummary | null>(
    mandala?.ai_summary || null
  )

  const handleGenerateReport = async () => {
    if (!mandala) return

    setIsGenerating(true)
    try {
      const report = await generateAIReport(mandala)
      setAiReport(report)

      await updateMandala({
        ai_summary: report,
        completed_days: [...(mandala.completed_days || []), 14],
      })
    } catch (error) {
      console.error('Failed to generate AI report:', error)
      alert('AI 리포트 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" message="로딩 중..." />
      </div>
    )
  }

  if (!mandala) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600">만다라트를 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container className="py-8">
        <div className="space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              종합 리포트 (Day 14)
            </h1>
            <p className="text-gray-600">
              14일간의 여정을 AI가 분석한 종합 리포트입니다.
            </p>
          </div>

          {/* Generate Report Button */}
          {!aiReport && (
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                AI 종합 리포트 생성
              </h2>
              <p className="text-gray-600 mb-6">
                AI가 회고와 목표를 분석하여 종합 리포트를 생성합니다.
              </p>
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                size="lg"
              >
                {isGenerating ? '생성 중...' : 'AI 리포트 생성하기'}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <Loading size="lg" message="AI가 리포트를 생성하고 있습니다..." />
            </div>
          )}

          {/* AI Report */}
          {aiReport && !isGenerating && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  회고 요약
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {aiReport.reflection_summary}
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  목표 구조 분석
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {aiReport.goal_analysis}
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  핵심 키워드
                </h3>
                <div className="flex flex-wrap gap-2">
                  {aiReport.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  통합 인사이트
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {aiReport.insights}
                </p>
              </div>
            </div>
          )}

          {/* Mandala Grid */}
          {aiReport && (
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                만다라트 9x9 그리드
              </h3>
              <MandalaGrid mandala={mandala} />
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
