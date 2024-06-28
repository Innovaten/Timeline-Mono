/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const SupportLazyImport = createFileRoute('/support')()
const StudentsLazyImport = createFileRoute('/students')()
const RegistrationsLazyImport = createFileRoute('/registrations')()
const LoginLazyImport = createFileRoute('/login')()
const ClassesLazyImport = createFileRoute('/classes')()
const CalendarLazyImport = createFileRoute('/calendar')()
const AnnouncementsLazyImport = createFileRoute('/announcements')()
const AdministratorsLazyImport = createFileRoute('/administrators')()
const IndexLazyImport = createFileRoute('/')()
const ClassesclassCodeLazyImport = createFileRoute('/classes/${classCode}')()
const ClassesclassCodeLessonsLazyImport = createFileRoute(
  '/classes/${classCode}/lessons',
)()

// Create/Update Routes

const SupportLazyRoute = SupportLazyImport.update({
  path: '/support',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/support.lazy').then((d) => d.Route))

const StudentsLazyRoute = StudentsLazyImport.update({
  path: '/students',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/students.lazy').then((d) => d.Route))

const RegistrationsLazyRoute = RegistrationsLazyImport.update({
  path: '/registrations',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/registrations.lazy').then((d) => d.Route))

const LoginLazyRoute = LoginLazyImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const ClassesLazyRoute = ClassesLazyImport.update({
  path: '/classes',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/classes.lazy').then((d) => d.Route))

const CalendarLazyRoute = CalendarLazyImport.update({
  path: '/calendar',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/calendar.lazy').then((d) => d.Route))

const AnnouncementsLazyRoute = AnnouncementsLazyImport.update({
  path: '/announcements',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/announcements.lazy').then((d) => d.Route))

const AdministratorsLazyRoute = AdministratorsLazyImport.update({
  path: '/administrators',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/administrators.lazy').then((d) => d.Route),
)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const ClassesclassCodeLazyRoute = ClassesclassCodeLazyImport.update({
  path: '/${classCode}',
  getParentRoute: () => ClassesLazyRoute,
} as any).lazy(() =>
  import('./routes/classes.${classCode}.lazy').then((d) => d.Route),
)

const ClassesclassCodeLessonsLazyRoute =
  ClassesclassCodeLessonsLazyImport.update({
    path: '/lessons',
    getParentRoute: () => ClassesclassCodeLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.${classCode}.lessons.lazy').then((d) => d.Route),
  )

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/administrators': {
      id: '/administrators'
      path: '/administrators'
      fullPath: '/administrators'
      preLoaderRoute: typeof AdministratorsLazyImport
      parentRoute: typeof rootRoute
    }
    '/announcements': {
      id: '/announcements'
      path: '/announcements'
      fullPath: '/announcements'
      preLoaderRoute: typeof AnnouncementsLazyImport
      parentRoute: typeof rootRoute
    }
    '/calendar': {
      id: '/calendar'
      path: '/calendar'
      fullPath: '/calendar'
      preLoaderRoute: typeof CalendarLazyImport
      parentRoute: typeof rootRoute
    }
    '/classes': {
      id: '/classes'
      path: '/classes'
      fullPath: '/classes'
      preLoaderRoute: typeof ClassesLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/registrations': {
      id: '/registrations'
      path: '/registrations'
      fullPath: '/registrations'
      preLoaderRoute: typeof RegistrationsLazyImport
      parentRoute: typeof rootRoute
    }
    '/students': {
      id: '/students'
      path: '/students'
      fullPath: '/students'
      preLoaderRoute: typeof StudentsLazyImport
      parentRoute: typeof rootRoute
    }
    '/support': {
      id: '/support'
      path: '/support'
      fullPath: '/support'
      preLoaderRoute: typeof SupportLazyImport
      parentRoute: typeof rootRoute
    }
    '/classes/${classCode}': {
      id: '/classes/${classCode}'
      path: '/${classCode}'
      fullPath: '/classes/${classCode}'
      preLoaderRoute: typeof ClassesclassCodeLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/${classCode}/lessons': {
      id: '/classes/${classCode}/lessons'
      path: '/lessons'
      fullPath: '/classes/${classCode}/lessons'
      preLoaderRoute: typeof ClassesclassCodeLessonsLazyImport
      parentRoute: typeof ClassesclassCodeLazyImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  AdministratorsLazyRoute,
  AnnouncementsLazyRoute,
  CalendarLazyRoute,
  ClassesLazyRoute: ClassesLazyRoute.addChildren({
    ClassesclassCodeLazyRoute: ClassesclassCodeLazyRoute.addChildren({
      ClassesclassCodeLessonsLazyRoute,
    }),
  }),
  LoginLazyRoute,
  RegistrationsLazyRoute,
  StudentsLazyRoute,
  SupportLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/administrators",
        "/announcements",
        "/calendar",
        "/classes",
        "/login",
        "/registrations",
        "/students",
        "/support"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/administrators": {
      "filePath": "administrators.lazy.tsx"
    },
    "/announcements": {
      "filePath": "announcements.lazy.tsx"
    },
    "/calendar": {
      "filePath": "calendar.lazy.tsx"
    },
    "/classes": {
      "filePath": "classes.lazy.tsx",
      "children": [
        "/classes/${classCode}"
      ]
    },
    "/login": {
      "filePath": "login.lazy.tsx"
    },
    "/registrations": {
      "filePath": "registrations.lazy.tsx"
    },
    "/students": {
      "filePath": "students.lazy.tsx"
    },
    "/support": {
      "filePath": "support.lazy.tsx"
    },
    "/classes/${classCode}": {
      "filePath": "classes.${classCode}.lazy.tsx",
      "parent": "/classes",
      "children": [
        "/classes/${classCode}/lessons"
      ]
    },
    "/classes/${classCode}/lessons": {
      "filePath": "classes.${classCode}.lessons.lazy.tsx",
      "parent": "/classes/${classCode}"
    }
  }
}
ROUTE_MANIFEST_END */
