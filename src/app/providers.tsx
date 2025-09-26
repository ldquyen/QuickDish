'use client'

import {HeroUIProvider} from '@heroui/react'
import {ToastProvider} from "@heroui/toast";
import { PreOrderProvider } from '@/contexts/PreOrderContext';

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <PreOrderProvider>
        {children}
      </PreOrderProvider>
    </HeroUIProvider>
  )
}