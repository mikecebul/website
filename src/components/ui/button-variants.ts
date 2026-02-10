import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-border bg-background hover:bg-card hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        brand: 'bg-brand text-primary-foreground hover:bg-brand/90',
        brandOutline:
          'border border-brand border-2 bg-background font-semibold text-brand hover:bg-card hover:text-accent-foreground',
        nav: 'text-lg font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 rounded-lg',
        text: '',
        card: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        clear: '',
        default: 'h-10 px-4 py-2',
        xs: 'h-8 px-2 text-xs',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        xl: 'h-12 px-8',
        icon: 'size-10',
        'icon-xs': 'size-6',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

export { buttonVariants }
export type { ButtonVariants }
