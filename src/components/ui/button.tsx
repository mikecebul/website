'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'

import { cn } from '@/utilities/cn'
import { buttonVariants, type ButtonVariants } from '@/components/ui/button-variants'

type ButtonProps = ButtonPrimitive.Props & ButtonVariants

function Button({ className, size = 'default', variant = 'default', ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
