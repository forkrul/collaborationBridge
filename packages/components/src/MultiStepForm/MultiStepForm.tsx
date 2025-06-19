import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, generateId } from '@company/core'
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '../Button'
import { Progress } from '../Progress'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  ComponentSize 
} from '@company/core'

const multiStepFormVariants = cva(
  'space-y-6',
  {
    variants: {
      variant: {
        default: '',
        card: 'p-6 border rounded-lg bg-card',
        minimal: 'space-y-4',
      },
      size: {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface StepComponentProps {
  /** Function to proceed to next step */
  onNext: () => void
  /** Function to go to previous step */
  onPrevious: () => void
  /** Whether this is the first step */
  isFirst: boolean
  /** Whether this is the last step */
  isLast: boolean
  /** Current form data */
  data: any
  /** Function to update form data */
  updateData: (data: any) => void
  /** Whether the form is currently validating */
  isValidating: boolean
}

export interface Step {
  /** Unique step identifier */
  id: string
  /** Step title */
  title: string
  /** Optional step description */
  description?: string
  /** Step component to render */
  component: React.ComponentType<StepComponentProps>
  /** Optional validation function */
  validation?: (data: any) => boolean | Promise<boolean>
  /** Whether this step can be skipped */
  optional?: boolean
  /** Custom icon for the step */
  icon?: React.ReactNode
}

export interface MultiStepFormProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof multiStepFormVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Array of steps */
  steps: Step[]
  /** Callback when form is completed */
  onComplete: (data: any) => void
  /** Callback when form is cancelled */
  onCancel?: () => void
  /** Visual variant */
  variant?: 'default' | 'card' | 'minimal'
  /** Size variant */
  size?: ComponentSize
  /** Whether to show progress bar */
  showProgress?: boolean
  /** Whether to show step indicators */
  showStepIndicator?: boolean
  /** Whether steps can be skipped */
  allowSkip?: boolean
  /** Whether to allow going back to previous steps */
  allowBack?: boolean
  /** Initial step index */
  initialStep?: number
  /** Custom validation error handler */
  onValidationError?: (step: Step, error: any) => void
}

const MultiStepForm = React.forwardRef<HTMLDivElement, MultiStepFormProps>(
  ({
    className,
    steps,
    onComplete,
    onCancel,
    variant,
    size,
    showProgress = true,
    showStepIndicator = true,
    allowSkip = false,
    allowBack = true,
    initialStep = 0,
    onValidationError,
    'data-testid': testId,
    ...props
  }, ref) => {
    const [currentStepIndex, setCurrentStepIndex] = React.useState(initialStep)
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
        const isValid = await currentStep.validation(formData)
        return isValid
      } catch (error) {
        onValidationError?.(currentStep, error)
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
      if (!isFirst && allowBack) {
        setCurrentStepIndex(prev => prev - 1)
      }
    }

    const goToStep = (stepIndex: number) => {
      if (
        allowSkip || 
        completedSteps.has(stepIndex - 1) || 
        stepIndex <= currentStepIndex ||
        stepIndex === 0
      ) {
        setCurrentStepIndex(stepIndex)
      }
    }

    const skipStep = () => {
      if (allowSkip && currentStep.optional && !isLast) {
        setCurrentStepIndex(prev => prev + 1)
      }
    }

    const StepComponent = currentStep.component

    return (
      <div
        ref={ref}
        className={cn(multiStepFormVariants({ variant, size }), className)}
        data-testid={testId}
        {...props}
      >
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
        {showStepIndicator && (
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(index)
              const isCurrent = index === currentStepIndex
              const isAccessible = allowSkip || index <= currentStepIndex || completedSteps.has(index - 1) || index === 0

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => isAccessible && goToStep(index)}
                    disabled={!isAccessible}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors",
                      isCompleted && "bg-primary text-primary-foreground",
                      isCurrent && !isCompleted && "bg-primary/20 text-primary border-2 border-primary",
                      !isCurrent && !isCompleted && isAccessible && "bg-muted text-muted-foreground hover:bg-muted/80",
                      !isAccessible && "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                    )}
                    title={step.title}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      index + 1
                    )}
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-8 h-0.5 mx-1",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[300px]">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{currentStep.title}</h2>
                {currentStep.description && (
                  <p className="text-muted-foreground mt-2">{currentStep.description}</p>
                )}
              </div>
              {currentStep.optional && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Optional
                </span>
              )}
            </div>
          </div>

          <StepComponent
            onNext={goToNext}
            onPrevious={goToPrevious}
            isFirst={isFirst}
            isLast={isLast}
            data={formData}
            updateData={updateData}
            isValidating={isValidating}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div>
            {!isFirst && allowBack && (
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={isValidating}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
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
                Cancel
              </Button>
            )}
            
            {allowSkip && currentStep.optional && !isLast && (
              <Button
                variant="outline"
                onClick={skipStep}
                disabled={isValidating}
              >
                Skip
              </Button>
            )}
            
            <Button
              onClick={goToNext}
              disabled={isValidating}
              className="min-w-[100px]"
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLast ? 'Complete' : 'Next'}
                  {!isLast && <ChevronRight className="h-4 w-4 ml-2" />}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

MultiStepForm.displayName = 'MultiStepForm'

export { MultiStepForm, multiStepFormVariants }
