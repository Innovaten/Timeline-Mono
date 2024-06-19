import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/announcements')({
  component: () => <Announcements />
})

function Announcements({}){

  return (
    <>
      Hi from Annoucements. <br />
      Implement Me.
    </>
  )

}