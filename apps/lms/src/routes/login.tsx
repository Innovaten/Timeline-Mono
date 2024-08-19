import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const LoginSearchSchema = z.object({
    destination: z.string().catch('/'),
})

export const Route = createFileRoute("/login")({
  validateSearch: LoginSearchSchema
});