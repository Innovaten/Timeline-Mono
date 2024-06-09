import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/classes')({
  component: () => <Classes />
})

function Classes({}){

  return (
    <>
      Hi from Classes. <br />
      Implement Me.
    </>
  )

}