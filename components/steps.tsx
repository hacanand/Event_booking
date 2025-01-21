import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
}

interface StepsProps {
  steps: Step[]
  currentStep: number
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="relative py-12">
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2" aria-hidden="true">
        <div className="h-0.5 w-full bg-gray-200" />
      </div>
      <ul className="relative flex justify-between items-center w-full">
        {steps.map((step) => (
          <li key={step.id} className="flex flex-col items-center relative">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center z-10",
                step.id <= currentStep ? "bg-[#00FF8C] text-[#14144B]" : "bg-gray-200 text-gray-500",
              )}
            >
              {step.id}
            </div>
            <span
              className={cn(
                "absolute top-14 text-xs font-medium text-center w-20",
                step.id <= currentStep ? "text-[#14144B]" : "text-gray-500",
              )}
            >
              {step.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

