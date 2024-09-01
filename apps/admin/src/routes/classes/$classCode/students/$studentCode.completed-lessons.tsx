import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/classes/$classCode/students/$studentCode/completed-lessons')({
  component: () => <div>Hello /classes/$classCode/students/$studentCode/completed-lessons!</div>
})