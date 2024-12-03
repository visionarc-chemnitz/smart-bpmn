import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { config } from "@/config"
export const apiWrapperurl = config.URL

export const apiWrapper = async (uri: string, method: string, body: any) => {
  try {
    const response = await fetch(apiWrapperurl + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error in apiWrapper:', error)
    throw error
  }
}