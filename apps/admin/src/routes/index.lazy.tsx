import { Navigate, createLazyFileRoute } from '@tanstack/react-router'
import IndexPage from '../pages/index.page'
import { _getToken } from '@repo/utils';

export const Route = createLazyFileRoute('/')({
  component: IndexRoute,
})


function IndexRoute({}){
  const authToken = _getToken();

  if(authToken){
      Navigate({ to: "/"});
  } else {
    return <IndexPage />
  }
}