"use client"

import * as React from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Step {
  id: string
  title: string
  description?: string
  component: React.ComponentType<StepComponentProps>
  validation?: () => boolean | Promise<boolean>
}

interface StepComponentProps {
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
  data: any
  updateData: (data: any) => void
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: (data: any) => void
  onCancel?: () => void
  className?: string
  showProgress?: boolean
  allowSkip?: boolean
}

export function MultiStepForm({
  steps,
  onComplete,
  onCancel,
  className,
  showProgress = true,
  allowSkip = false,
}: MultiStepFormProps) {
  const t = useTranslations('common')
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())
  const [formData, setFormData] = React.useState<any>({})
  const [isValidating, setIsValidating] = React.useState(false)

  const currentStep = steps[currentStepIndex]
  const isFirst = currentStepIndex === 0
  const isLast = currentStepIndex === steps.length - 1
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const updateData = React.useCallback((data: any) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  const validateCurrentStep = async (): Promise<boolean> => {
    if (!currentStep.validation) return true
    
    setIsValidating(true)
    try {
      const isValid = await currentStep.validation()
      return isValid
    } catch (error) {
      console.error('Step validation error:', error)
      return false
    } finally {
      setIsValidating(false)
    }
  }

  const goToNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    setCompletedSteps(prev => new Set([...prev, currentStepIndex]))
    
    if (isLast) {
      onComplete(formData)
    } else {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const goToPrevious = () => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (allowSkip || completedSteps.has(stepIndex - 1) || stepIndex <= currentStepIndex) {
      setCurrentStepIndex(stepIndex)
    }
  }

  const StepComponent = currentStep.component

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index)
          const isCurrent = index === currentStepIndex
          const isAccessible = allowSkip || index <= currentStepIndex || completedSteps.has(index - 1)

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isAccessible && goToStep(index)}
                disabled={!isAccessible}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && !isCompleted && "bg-primary/20 text-primary border-2 border-primary",
                  !isCurrent && !isCompleted && isAccessible && "bg-muted text-muted-foreground hover:bg-muted/80",
                  !isAccessible && "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-12 h-0.5 mx-2",
                  isCompleted ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{currentStep.title}</h2>
          {currentStep.description && (
            <p className="text-muted-foreground mt-2">{currentStep.description}</p>
          )}
        </div>

        <StepComponent
          onNext={goToNext}
          onPrevious={goToPrevious}
          isFirst={isFirst}
          isLast={isLast}
          data={formData}
          updateData={updateData}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div>
          {!isFirst && (
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={isValidating}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('previous') || 'Previous'}
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isValidating}
            >
              {t('cancel')}
            </Button>
          )}
          
          <Button
            onClick={goToNext}
            disabled={isValidating}
            className="min-w-[100px]"
          >
            {isValidating ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <>
                {isLast ? (t('complete') || 'Complete') : (t('next') || 'Next')}
                {!isLast && <ChevronRight className="h-4 w-4 ml-2" />}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Example usage component
export function ExampleMultiStepForm() {
  const [formData, setFormData] = React.useState({})

  const steps: Step[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      component: ({ data, updateData, onNext }) => (
        <div className="space-y-4">
          <input
            placeholder="First Name"
            value={data.firstName || ''}
            onChange={(e) => updateData({ firstName: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="Last Name"
            value={data.lastName || ''}
            onChange={(e) => updateData({ lastName: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      ),
      validation: () => {
        return !!(formData as any).firstName && !!(formData as any).lastName
      }
    },
    {
      id: 'contact',
      title: 'Contact Details',
      description: 'How can we reach you?',
      component: ({ data, updateData }) => (
        <div className="space-y-4">
          <input
            placeholder="Email"
            type="email"
            value={data.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="Phone"
            value={data.phone || ''}
            onChange={(e) => updateData({ phone: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      ),
      validation: () => {
        return !!(formData as any).email
      }
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Please review your information',
      component: ({ data }) => (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Personal Information</h3>
            <p>Name: {data.firstName} {data.lastName}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Contact Details</h3>
            <p>Email: {data.email}</p>
            <p>Phone: {data.phone}</p>
          </div>
        </div>
      )
    }
  ]

  const handleComplete = (data: any) => {
    console.log('Form completed with data:', data)
    setFormData(data)
  }

  return (
    <MultiStepForm
      steps={steps}
      onComplete={handleComplete}
      showProgress={true}
      allowSkip={false}
    />
  )
}
