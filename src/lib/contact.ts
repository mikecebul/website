import { z } from 'zod'

import { websiteContent } from '@/lib/website-content'

const inquiryTypeSet = new Set(websiteContent.contact.inquiryTypes)

export const contactFormSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  inquiryType: z
    .string()
    .trim()
    .refine((value) => inquiryTypeSet.has(value), 'Choose the type of inquiry that fits best.'),
  message: z
    .string()
    .trim()
    .min(10, 'Share a little more detail so I can understand the project.')
    .max(800, 'Keep the message under 800 characters.'),
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(80, 'Please keep your name under 80 characters.'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
