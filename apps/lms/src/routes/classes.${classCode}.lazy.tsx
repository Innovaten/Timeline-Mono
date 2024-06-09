import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/classes/${classCode}')({
  component: () => <ClassDetails />
})

function ClassDetails({}){

  return (
    <>
      Hi from Class details. <br />
      Implement Me.
    </>
  )

}