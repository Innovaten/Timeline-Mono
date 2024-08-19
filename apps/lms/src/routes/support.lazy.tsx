import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/support')({
  component: () => <Support />
})

function Support({}){

  return (
    <>
      Hi from Support. <br />
      Implement Me.
    </>
  )

}