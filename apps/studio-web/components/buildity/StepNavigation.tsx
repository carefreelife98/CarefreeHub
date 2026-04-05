"use client"

interface Props {
  onBack: () => void
  onNext: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isLoading: boolean
}

export function StepNavigation({ onBack, onNext, isFirstStep, isLastStep, isLoading }: Props) {
  return (
    <div className="flex justify-between pt-4 border-t border-border">
      <button
        onClick={onBack}
        disabled={isFirstStep}
        className="border border-border rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        이전
      </button>
      <button
        onClick={onNext}
        disabled={isLoading}
        className={`rounded-xl px-5 py-2.5 text-sm font-display font-bold text-primary-foreground shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          isLastStep ? "bg-buildity" : "bg-primary"
        }`}
      >
        {isLastStep ? "PRD 생성" : "다음"}
      </button>
    </div>
  )
}
