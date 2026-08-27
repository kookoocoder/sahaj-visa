import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      richColors
      closeButton
    />
  )
}
