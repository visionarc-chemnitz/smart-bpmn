import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { config } from "@/config"
import prisma from "@/lib/prisma"

type allowedMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface ApiWrapperProps {
  url?: string
  uri: string
  method: allowedMethods
  body?: any
}

export const apiWrapper = async ({url = config.NextURL , uri, method, body}: ApiWrapperProps) => {
  try {
    const response = await fetch(url + uri, {
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

export function getInitials(name: string) {
  const words = name.split(" ");
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}