import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/classes/${classCode}/lessons')({
  component: () => <ClassLessons />
})

function ClassLessons({}){

  return (
    <>
      Hi from Class Lessons.<br />
      Implement Me.
    </>
  )

}