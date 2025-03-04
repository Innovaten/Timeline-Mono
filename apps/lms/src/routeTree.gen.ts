/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'

// Create Virtual Routes

const SupportLazyImport = createFileRoute('/support')()
const RegisterLazyImport = createFileRoute('/register')()
const ClassesLazyImport = createFileRoute('/classes')()
const AnnouncementsLazyImport = createFileRoute('/announcements')()
const IndexLazyImport = createFileRoute('/')()
const AssignmentsIndexLazyImport = createFileRoute('/assignments/')()
const ClassesclassCodeLazyImport = createFileRoute('/classes/${classCode}')()
const AnnouncementsAnnouncementCodeLazyImport = createFileRoute(
  '/announcements/$announcementCode',
)()
const ClassesClassCodeIndexLazyImport = createFileRoute(
  '/classes/$classCode/',
)()
const RegisterAcceptIdLazyImport = createFileRoute('/register/accept/$id')()
const ClassesclassCodeLessonsLazyImport = createFileRoute(
  '/classes/${classCode}/lessons',
)()
const ClassesClassCodeModulesLazyImport = createFileRoute(
  '/classes/$classCode/modules',
)()
const ClassesClassCodeCompletedModulesLazyImport = createFileRoute(
  '/classes/$classCode/completedModules',
)()
const ClassesClassCodeCompletedLessonsLazyImport = createFileRoute(
  '/classes/$classCode/completedLessons',
)()
const ClassesClassCodeAssignmentsIndexLazyImport = createFileRoute(
  '/classes/$classCode/assignments/',
)()
const ClassesClassCodeAnnouncementsIndexLazyImport = createFileRoute(
  '/classes/$classCode/announcements/',
)()
const ClassesClassCodeModulesModuleCodeLazyImport = createFileRoute(
  '/classes/$classCode/modules/$moduleCode',
)()
const ClassesClassCodeAssignmentsAssignmentCodeLazyImport = createFileRoute(
  '/classes/$classCode/assignments/$assignmentCode',
)()
const ClassesClassCodeAnnouncementsAnnouncementCodeLazyImport = createFileRoute(
  '/classes/$classCode/announcements/$announcementCode',
)()
const ClassesClassCodeModulesModuleCodeLessonCodeLazyImport = createFileRoute(
  '/classes/$classCode/modules/$moduleCode/$lessonCode',
)()

// Create/Update Routes

const SupportLazyRoute = SupportLazyImport.update({
  path: '/support',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/support.lazy').then((d) => d.Route))

const RegisterLazyRoute = RegisterLazyImport.update({
  path: '/register',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/register.lazy').then((d) => d.Route))

const ClassesLazyRoute = ClassesLazyImport.update({
  path: '/classes',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/classes.lazy').then((d) => d.Route))

const AnnouncementsLazyRoute = AnnouncementsLazyImport.update({
  path: '/announcements',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/announcements.lazy').then((d) => d.Route))

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AssignmentsIndexLazyRoute = AssignmentsIndexLazyImport.update({
  path: '/assignments/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/assignments/index.lazy').then((d) => d.Route),
)

const ClassesclassCodeLazyRoute = ClassesclassCodeLazyImport.update({
  path: '/${classCode}',
  getParentRoute: () => ClassesLazyRoute,
} as any).lazy(() =>
  import('./routes/classes.${classCode}.lazy').then((d) => d.Route),
)

const AnnouncementsAnnouncementCodeLazyRoute =
  AnnouncementsAnnouncementCodeLazyImport.update({
    path: '/$announcementCode',
    getParentRoute: () => AnnouncementsLazyRoute,
  } as any).lazy(() =>
    import('./routes/announcements.$announcementCode.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeIndexLazyRoute = ClassesClassCodeIndexLazyImport.update({
  path: '/$classCode/',
  getParentRoute: () => ClassesLazyRoute,
} as any).lazy(() =>
  import('./routes/classes/$classCode/index.lazy').then((d) => d.Route),
)

const RegisterAcceptIdLazyRoute = RegisterAcceptIdLazyImport.update({
  path: '/accept/$id',
  getParentRoute: () => RegisterLazyRoute,
} as any).lazy(() =>
  import('./routes/register.accept.$id.lazy').then((d) => d.Route),
)

const ClassesclassCodeLessonsLazyRoute =
  ClassesclassCodeLessonsLazyImport.update({
    path: '/lessons',
    getParentRoute: () => ClassesclassCodeLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.${classCode}.lessons.lazy').then((d) => d.Route),
  )

const ClassesClassCodeModulesLazyRoute =
  ClassesClassCodeModulesLazyImport.update({
    path: '/$classCode/modules',
    getParentRoute: () => ClassesLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.modules.lazy').then((d) => d.Route),
  )

const ClassesClassCodeCompletedModulesLazyRoute =
  ClassesClassCodeCompletedModulesLazyImport.update({
    path: '/$classCode/completedModules',
    getParentRoute: () => ClassesLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.completedModules.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeCompletedLessonsLazyRoute =
  ClassesClassCodeCompletedLessonsLazyImport.update({
    path: '/$classCode/completedLessons',
    getParentRoute: () => ClassesLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.completedLessons.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeAssignmentsIndexLazyRoute =
  ClassesClassCodeAssignmentsIndexLazyImport.update({
    path: '/$classCode/assignments/',
    getParentRoute: () => ClassesLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes/$classCode/assignments/index.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeAnnouncementsIndexLazyRoute =
  ClassesClassCodeAnnouncementsIndexLazyImport.update({
    path: '/$classCode/announcements/',
    getParentRoute: () => ClassesLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes/$classCode/announcements/index.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeModulesModuleCodeLazyRoute =
  ClassesClassCodeModulesModuleCodeLazyImport.update({
    path: '/$moduleCode',
    getParentRoute: () => ClassesClassCodeModulesLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.modules.$moduleCode.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeAssignmentsAssignmentCodeLazyRoute =
  ClassesClassCodeAssignmentsAssignmentCodeLazyImport.update({
    path: '/$classCode/assignments/$assignmentCode',
    getParentRoute: () => ClassesLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes/$classCode/assignments/$assignmentCode.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeAnnouncementsAnnouncementCodeLazyRoute =
  ClassesClassCodeAnnouncementsAnnouncementCodeLazyImport.update({
    path: '/$classCode/announcements/$announcementCode',
    getParentRoute: () => ClassesLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes/$classCode/announcements/$announcementCode.lazy'
    ).then((d) => d.Route),
  )

const ClassesClassCodeModulesModuleCodeLessonCodeLazyRoute =
  ClassesClassCodeModulesModuleCodeLessonCodeLazyImport.update({
    path: '/$lessonCode',
    getParentRoute: () => ClassesClassCodeModulesModuleCodeLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes.$classCode.modules.$moduleCode.$lessonCode.lazy'
    ).then((d) => d.Route),
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
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/announcements': {
      id: '/announcements'
      path: '/announcements'
      fullPath: '/announcements'
      preLoaderRoute: typeof AnnouncementsLazyImport
      parentRoute: typeof rootRoute
    }
    '/classes': {
      id: '/classes'
      path: '/classes'
      fullPath: '/classes'
      preLoaderRoute: typeof ClassesLazyImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterLazyImport
      parentRoute: typeof rootRoute
    }
    '/support': {
      id: '/support'
      path: '/support'
      fullPath: '/support'
      preLoaderRoute: typeof SupportLazyImport
      parentRoute: typeof rootRoute
    }
    '/announcements/$announcementCode': {
      id: '/announcements/$announcementCode'
      path: '/$announcementCode'
      fullPath: '/announcements/$announcementCode'
      preLoaderRoute: typeof AnnouncementsAnnouncementCodeLazyImport
      parentRoute: typeof AnnouncementsLazyImport
    }
    '/classes/${classCode}': {
      id: '/classes/${classCode}'
      path: '/${classCode}'
      fullPath: '/classes/${classCode}'
      preLoaderRoute: typeof ClassesclassCodeLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/assignments/': {
      id: '/assignments/'
      path: '/assignments'
      fullPath: '/assignments'
      preLoaderRoute: typeof AssignmentsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/classes/$classCode/completedLessons': {
      id: '/classes/$classCode/completedLessons'
      path: '/$classCode/completedLessons'
      fullPath: '/classes/$classCode/completedLessons'
      preLoaderRoute: typeof ClassesClassCodeCompletedLessonsLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/$classCode/completedModules': {
      id: '/classes/$classCode/completedModules'
      path: '/$classCode/completedModules'
      fullPath: '/classes/$classCode/completedModules'
      preLoaderRoute: typeof ClassesClassCodeCompletedModulesLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/$classCode/modules': {
      id: '/classes/$classCode/modules'
      path: '/$classCode/modules'
      fullPath: '/classes/$classCode/modules'
      preLoaderRoute: typeof ClassesClassCodeModulesLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/${classCode}/lessons': {
      id: '/classes/${classCode}/lessons'
      path: '/lessons'
      fullPath: '/classes/${classCode}/lessons'
      preLoaderRoute: typeof ClassesclassCodeLessonsLazyImport
      parentRoute: typeof ClassesclassCodeLazyImport
    }
    '/register/accept/$id': {
      id: '/register/accept/$id'
      path: '/accept/$id'
      fullPath: '/register/accept/$id'
      preLoaderRoute: typeof RegisterAcceptIdLazyImport
      parentRoute: typeof RegisterLazyImport
    }
    '/classes/$classCode/': {
      id: '/classes/$classCode/'
      path: '/$classCode'
      fullPath: '/classes/$classCode'
      preLoaderRoute: typeof ClassesClassCodeIndexLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/$classCode/announcements/$announcementCode': {
      id: '/classes/$classCode/announcements/$announcementCode'
      path: '/$classCode/announcements/$announcementCode'
      fullPath: '/classes/$classCode/announcements/$announcementCode'
      preLoaderRoute: typeof ClassesClassCodeAnnouncementsAnnouncementCodeLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/$classCode/assignments/$assignmentCode': {
      id: '/classes/$classCode/assignments/$assignmentCode'
      path: '/$classCode/assignments/$assignmentCode'
      fullPath: '/classes/$classCode/assignments/$assignmentCode'
      preLoaderRoute: typeof ClassesClassCodeAssignmentsAssignmentCodeLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/$classCode/modules/$moduleCode': {
      id: '/classes/$classCode/modules/$moduleCode'
      path: '/$moduleCode'
      fullPath: '/classes/$classCode/modules/$moduleCode'
      preLoaderRoute: typeof ClassesClassCodeModulesModuleCodeLazyImport
      parentRoute: typeof ClassesClassCodeModulesLazyImport
    }
    '/classes/$classCode/announcements/': {
      id: '/classes/$classCode/announcements/'
      path: '/$classCode/announcements'
      fullPath: '/classes/$classCode/announcements'
      preLoaderRoute: typeof ClassesClassCodeAnnouncementsIndexLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/$classCode/assignments/': {
      id: '/classes/$classCode/assignments/'
      path: '/$classCode/assignments'
      fullPath: '/classes/$classCode/assignments'
      preLoaderRoute: typeof ClassesClassCodeAssignmentsIndexLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/$classCode/modules/$moduleCode/$lessonCode': {
      id: '/classes/$classCode/modules/$moduleCode/$lessonCode'
      path: '/$lessonCode'
      fullPath: '/classes/$classCode/modules/$moduleCode/$lessonCode'
      preLoaderRoute: typeof ClassesClassCodeModulesModuleCodeLessonCodeLazyImport
      parentRoute: typeof ClassesClassCodeModulesModuleCodeLazyImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  LoginRoute,
  AnnouncementsLazyRoute: AnnouncementsLazyRoute.addChildren({
    AnnouncementsAnnouncementCodeLazyRoute,
  }),
  ClassesLazyRoute: ClassesLazyRoute.addChildren({
    ClassesclassCodeLazyRoute: ClassesclassCodeLazyRoute.addChildren({
      ClassesclassCodeLessonsLazyRoute,
    }),
    ClassesClassCodeCompletedLessonsLazyRoute,
    ClassesClassCodeCompletedModulesLazyRoute,
    ClassesClassCodeModulesLazyRoute:
      ClassesClassCodeModulesLazyRoute.addChildren({
        ClassesClassCodeModulesModuleCodeLazyRoute:
          ClassesClassCodeModulesModuleCodeLazyRoute.addChildren({
            ClassesClassCodeModulesModuleCodeLessonCodeLazyRoute,
          }),
      }),
    ClassesClassCodeIndexLazyRoute,
    ClassesClassCodeAnnouncementsAnnouncementCodeLazyRoute,
    ClassesClassCodeAssignmentsAssignmentCodeLazyRoute,
    ClassesClassCodeAnnouncementsIndexLazyRoute,
    ClassesClassCodeAssignmentsIndexLazyRoute,
  }),
  RegisterLazyRoute: RegisterLazyRoute.addChildren({
    RegisterAcceptIdLazyRoute,
  }),
  SupportLazyRoute,
  AssignmentsIndexLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/login",
        "/announcements",
        "/classes",
        "/register",
        "/support",
        "/assignments/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/announcements": {
      "filePath": "announcements.lazy.tsx",
      "children": [
        "/announcements/$announcementCode"
      ]
    },
    "/classes": {
      "filePath": "classes.lazy.tsx",
      "children": [
        "/classes/${classCode}",
        "/classes/$classCode/completedLessons",
        "/classes/$classCode/completedModules",
        "/classes/$classCode/modules",
        "/classes/$classCode/",
        "/classes/$classCode/announcements/$announcementCode",
        "/classes/$classCode/assignments/$assignmentCode",
        "/classes/$classCode/announcements/",
        "/classes/$classCode/assignments/"
      ]
    },
    "/register": {
      "filePath": "register.lazy.tsx",
      "children": [
        "/register/accept/$id"
      ]
    },
    "/support": {
      "filePath": "support.lazy.tsx"
    },
    "/announcements/$announcementCode": {
      "filePath": "announcements.$announcementCode.lazy.tsx",
      "parent": "/announcements"
    },
    "/classes/${classCode}": {
      "filePath": "classes.${classCode}.lazy.tsx",
      "parent": "/classes",
      "children": [
        "/classes/${classCode}/lessons"
      ]
    },
    "/assignments/": {
      "filePath": "assignments/index.lazy.tsx"
    },
    "/classes/$classCode/completedLessons": {
      "filePath": "classes.$classCode.completedLessons.lazy.tsx",
      "parent": "/classes"
    },
    "/classes/$classCode/completedModules": {
      "filePath": "classes.$classCode.completedModules.lazy.tsx",
      "parent": "/classes"
    },
    "/classes/$classCode/modules": {
      "filePath": "classes.$classCode.modules.lazy.tsx",
      "parent": "/classes",
      "children": [
        "/classes/$classCode/modules/$moduleCode"
      ]
    },
    "/classes/${classCode}/lessons": {
      "filePath": "classes.${classCode}.lessons.lazy.tsx",
      "parent": "/classes/${classCode}"
    },
    "/register/accept/$id": {
      "filePath": "register.accept.$id.lazy.tsx",
      "parent": "/register"
    },
    "/classes/$classCode/": {
      "filePath": "classes/$classCode/index.lazy.tsx",
      "parent": "/classes"
    },
    "/classes/$classCode/announcements/$announcementCode": {
      "filePath": "classes/$classCode/announcements/$announcementCode.lazy.tsx",
      "parent": "/classes"
    },
    "/classes/$classCode/assignments/$assignmentCode": {
      "filePath": "classes/$classCode/assignments/$assignmentCode.lazy.tsx",
      "parent": "/classes"
    },
    "/classes/$classCode/modules/$moduleCode": {
      "filePath": "classes.$classCode.modules.$moduleCode.lazy.tsx",
      "parent": "/classes/$classCode/modules",
      "children": [
        "/classes/$classCode/modules/$moduleCode/$lessonCode"
      ]
    },
    "/classes/$classCode/announcements/": {
      "filePath": "classes/$classCode/announcements/index.lazy.tsx",
      "parent": "/classes"
    },
    "/classes/$classCode/assignments/": {
      "filePath": "classes/$classCode/assignments/index.lazy.tsx",
      "parent": "/classes"
    },
    "/classes/$classCode/modules/$moduleCode/$lessonCode": {
      "filePath": "classes.$classCode.modules.$moduleCode.$lessonCode.lazy.tsx",
      "parent": "/classes/$classCode/modules/$moduleCode"
    }
  }
}
ROUTE_MANIFEST_END */
