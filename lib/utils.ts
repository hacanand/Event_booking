import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// localization.ts
export const customLocalization = {
  socialButtons: {
    linkedin: {
      label: "Sign in with LinkedIn", // Update LinkedIn button text
    },
  },
};