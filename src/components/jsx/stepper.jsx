import { Children, useState, useMemo, useCallback, useRef, useLayoutEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

export default function Stepper({ children, className = "", onFinish = () => { } }) {
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

const StepperContainer = memo(({ direction, children, currentStep }) => {
  const stepRef = useRef()
  const [contentHeight, setContentHeight] = useState(0)
  const prevHeightRef = useRef(0)

  const variants = useMemo(() => ({
    enter: direction => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: direction => ({
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

const StepIndicator = memo(({ totalSteps, currentStep }) => {
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

const Buttons = memo(({ currentStep, totalSteps, onPrevious, onNext, onFinish }) => (
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

export const Step = memo(function Step({ children }) {
  return <>{children}</>
})

// usage
{/* <Stepper>
<Step>
    <h1 className='font-semibold text-xl text-[#00d8ff]'>
        Welcome to AeroUI stepper!
    </h1>
    <p>Check out the next step</p>
</Step>

<Step>
    <h1>Step 2</h1>
    <div className="relative w-full h-[170px] rounded-xl mt-4">
        <Image 
            src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            fill
            alt='randomImage' 
            className='object-cover rounded-2xl'
            priority
        />
    </div>
</Step>

<Step>
    <h1>Step 3</h1>
    <p>Almost there!</p>
</Step>

<Step>
    <h1>Final Step</h1>
    <p>Congratulations!</p>
</Step>
</Stepper> */}