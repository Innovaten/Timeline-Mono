import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/classes/$classCode/students/$studentCode/completed-modules')({
  component: () => <div>Hello /classes/$classCode/students/$studentCode/completed-modules!</div>
})