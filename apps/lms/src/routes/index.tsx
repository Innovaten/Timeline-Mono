import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const indexSearchSchema = z.object({
    destination: z.string().catch('/home'),
    register: z.boolean().catch(true)
})

export const Route = createFileRoute("/")({
  validateSearch: indexSearchSchema
});