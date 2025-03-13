import { Children, useState, useMemo, useCallback, useRef, useLayoutEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

interface StepperProps {
  children: React.ReactNode
  className?: string
  onFinish: () => void
}

export default function Stepper({ children, className, onFinish }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = useMemo(() => Children.toArray(children), [children])
  const totalSteps = steps.length
  const [direction, setDirection] = useState(1)

  const handlePrevious = useCallback(() => {
    setDirection(-1)
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  return (
    <div className={`min-w-[460px] overflow-hidden relative p-6 rounded-4xl border border-neutral-800 flex flex-col gap-4 ${className}`}>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <StepperContainer direction={direction} currentStep={currentStep}>
        {steps[currentStep]}
      </StepperContainer>

      <Buttons
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onFinish={onFinish}
      />
    </div>
  )
}

interface StepperContainerProps {
  direction: number
  children: React.ReactNode
  currentStep: number
}

const StepperContainer = memo(({ direction, children, currentStep }: StepperContainerProps) => {
  const stepRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const prevHeightRef = useRef(0)

  const variants = useMemo(() => ({
    enter: (direction: number) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? -200 : 200,
      opacity: 0,
      transition: { duration: 0.3 }
    })
  }), [])

  useLayoutEffect(() => {
    if (!stepRef.current) return
    const newHeight = stepRef.current.clientHeight
    if (newHeight !== prevHeightRef.current) {
      prevHeightRef.current = newHeight
      setContentHeight(newHeight)
    }
  }, [currentStep])

  return (
    <motion.div
      layout
      suppressHydrationWarning
      animate={{ height: contentHeight }}
      initial={false}
      style={{ height: contentHeight }}
      className="relative overflow-hidden w-full"
    >
      <AnimatePresence mode='sync' custom={direction} initial={false}>
        <motion.div
          custom={direction}
          key={currentStep}
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          ref={stepRef}
          className='absolute w-full'
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
})

interface StepIndicatorProps {
  totalSteps: number
  currentStep: number
}

const StepIndicator = memo(({ totalSteps, currentStep }: StepIndicatorProps) => {
  const progressPercent = (currentStep / (totalSteps - 1)) * 100
  const stepsArray = useMemo(() =>
    Array.from({ length: totalSteps }, (_, i) => i),
    [totalSteps]
  )

  return (
    <div className="relative w-full min-h-[2em] flex items-center">
      <div className="absolute w-full h-[1px] bg-neutral-600">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
          className="h-[1px] bg-[#00d8ff]"
        />
      </div>

      <div className="z-1 w-full flex justify-between">
        {stepsArray.map(i => (
          <motion.div
            key={i}
            className={`w-[44px] h-[44px] transition-all duration-300 border-[#060606] border-6 rounded-full ${i === currentStep || i < currentStep ? 'bg-[#00d8ff]' : 'bg-[#222222]'
              } flex items-center justify-center`}
          >
            {i === currentStep ? (
              <div className="w-[14px] h-[14px] bg-black rounded-full" />
            ) : i < currentStep ? (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Check stroke="#000" width={14} height={14} />
              </motion.div>
            ) : i}
          </motion.div>
        ))}
      </div>
    </div>
  )
})

interface ButtonsProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
}

const Buttons = memo(({ currentStep, totalSteps, onPrevious, onNext, onFinish } : ButtonsProps) => (
  <div className="relative w-full flex justify-between">

    {
      currentStep > 0 && (
        <button
          onClick={onPrevious}
          className="cursor-pointer text-[#ffffff94] py-1 rounded-xl"
        >
          Previous
        </button>
      )
    }

    <div></div>

    <button
      onClick={currentStep === totalSteps - 1 ? onFinish : onNext}
      className="cursor-pointer bg-[#00d8ff] text-black px-5 hover:bg-[#00aac8] py-1 rounded-xl"
    >
      {currentStep === totalSteps - 1 ? "Finish" : "Next"}
    </button>
  </div>
))

export const Step = memo(function Step({ children } : { children: React.ReactNode }) {
  return <>{children}</>
})