import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/calendar')({
  component: () => <Calendar />
})

function Calendar({}){

  return (
    <>
      Hi from Calendar.<br />
      Implement Me.
    </>
  )

}