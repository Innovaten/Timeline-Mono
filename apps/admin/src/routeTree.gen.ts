/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ClassesClassCodeAssignmentsAssignmentCodeSubmissionsSubmissionCodeImport } from './routes/classes.$classCode.assignments.$assignmentCode.submissions.$submissionCode'

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
const ClassesClassCodeLazyImport = createFileRoute('/classes/$classCode')()
const ClassesClassCodeModulesLazyImport = createFileRoute(
  '/classes/$classCode/modules',
)()
const ClassesClassCodeAssignmentsLazyImport = createFileRoute(
  '/classes/$classCode/assignments',
)()
const ClassesClassCodeAnnouncementsLazyImport = createFileRoute(
  '/classes/$classCode/announcements',
)()
const ClassesClassCodeModulesCreateLazyImport = createFileRoute(
  '/classes/$classCode/modules/create',
)()
const ClassesClassCodeModulesModuleCodeLazyImport = createFileRoute(
  '/classes/$classCode/modules/$moduleCode',
)()
const ClassesClassCodeAssignmentsCreateLazyImport = createFileRoute(
  '/classes/$classCode/assignments/create',
)()
const ClassesClassCodeAssignmentsAssignmentCodeLazyImport = createFileRoute(
  '/classes/$classCode/assignments/$assignmentCode',
)()
const ClassesClassCodeAnnouncementsCreateLazyImport = createFileRoute(
  '/classes/$classCode/announcements/create',
)()
const ClassesClassCodeAnnouncementsAnnouncementCodeLazyImport = createFileRoute(
  '/classes/$classCode/announcements/$announcementCode',
)()
const ClassesClassCodeModulesModuleCodeUpdateLazyImport = createFileRoute(
  '/classes/$classCode/modules/$moduleCode/update',
)()
const ClassesClassCodeModulesModuleCodeLessonsLazyImport = createFileRoute(
  '/classes/$classCode/modules/$moduleCode/lessons',
)()
const ClassesClassCodeAssignmentsAssignmentCodeUpdateLazyImport =
  createFileRoute('/classes/$classCode/assignments/$assignmentCode/update')()
const ClassesClassCodeAssignmentsAssignmentCodeSubmissionsLazyImport =
  createFileRoute(
    '/classes/$classCode/assignments/$assignmentCode/submissions',
  )()
const ClassesClassCodeAnnouncementsAnnouncementCodeUpdateLazyImport =
  createFileRoute(
    '/classes/$classCode/announcements/$announcementCode/update',
  )()
const ClassesClassCodeModulesModuleCodeLessonsCreateLazyImport =
  createFileRoute('/classes/$classCode/modules/$moduleCode/lessons/create')()
const ClassesClassCodeModulesModuleCodeLessonsLessonCodeLazyImport =
  createFileRoute(
    '/classes/$classCode/modules/$moduleCode/lessons/$lessonCode',
  )()
const ClassesClassCodeModulesModuleCodeLessonsLessonCodeUpdateLazyImport =
  createFileRoute(
    '/classes/$classCode/modules/$moduleCode/lessons/$lessonCode/update',
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

const ClassesClassCodeLazyRoute = ClassesClassCodeLazyImport.update({
  path: '/$classCode',
  getParentRoute: () => ClassesLazyRoute,
} as any).lazy(() =>
  import('./routes/classes.$classCode.lazy').then((d) => d.Route),
)

const ClassesClassCodeModulesLazyRoute =
  ClassesClassCodeModulesLazyImport.update({
    path: '/modules',
    getParentRoute: () => ClassesClassCodeLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.modules.lazy').then((d) => d.Route),
  )

const ClassesClassCodeAssignmentsLazyRoute =
  ClassesClassCodeAssignmentsLazyImport.update({
    path: '/assignments',
    getParentRoute: () => ClassesClassCodeLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.assignments.lazy').then((d) => d.Route),
  )

const ClassesClassCodeAnnouncementsLazyRoute =
  ClassesClassCodeAnnouncementsLazyImport.update({
    path: '/announcements',
    getParentRoute: () => ClassesClassCodeLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.announcements.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeModulesCreateLazyRoute =
  ClassesClassCodeModulesCreateLazyImport.update({
    path: '/create',
    getParentRoute: () => ClassesClassCodeModulesLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.modules.create.lazy').then(
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

const ClassesClassCodeAssignmentsCreateLazyRoute =
  ClassesClassCodeAssignmentsCreateLazyImport.update({
    path: '/create',
    getParentRoute: () => ClassesClassCodeAssignmentsLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.assignments.create.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeAssignmentsAssignmentCodeLazyRoute =
  ClassesClassCodeAssignmentsAssignmentCodeLazyImport.update({
    path: '/$assignmentCode',
    getParentRoute: () => ClassesClassCodeAssignmentsLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.assignments.$assignmentCode.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeAnnouncementsCreateLazyRoute =
  ClassesClassCodeAnnouncementsCreateLazyImport.update({
    path: '/create',
    getParentRoute: () => ClassesClassCodeAnnouncementsLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.announcements.create.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeAnnouncementsAnnouncementCodeLazyRoute =
  ClassesClassCodeAnnouncementsAnnouncementCodeLazyImport.update({
    path: '/$announcementCode',
    getParentRoute: () => ClassesClassCodeAnnouncementsLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes.$classCode.announcements.$announcementCode.lazy'
    ).then((d) => d.Route),
  )

const ClassesClassCodeModulesModuleCodeUpdateLazyRoute =
  ClassesClassCodeModulesModuleCodeUpdateLazyImport.update({
    path: '/update',
    getParentRoute: () => ClassesClassCodeModulesModuleCodeLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.modules.$moduleCode.update.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeModulesModuleCodeLessonsLazyRoute =
  ClassesClassCodeModulesModuleCodeLessonsLazyImport.update({
    path: '/lessons',
    getParentRoute: () => ClassesClassCodeModulesModuleCodeLazyRoute,
  } as any).lazy(() =>
    import('./routes/classes.$classCode.modules.$moduleCode.lessons.lazy').then(
      (d) => d.Route,
    ),
  )

const ClassesClassCodeAssignmentsAssignmentCodeUpdateLazyRoute =
  ClassesClassCodeAssignmentsAssignmentCodeUpdateLazyImport.update({
    path: '/update',
    getParentRoute: () => ClassesClassCodeAssignmentsAssignmentCodeLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes.$classCode.assignments.$assignmentCode.update.lazy'
    ).then((d) => d.Route),
  )

const ClassesClassCodeAssignmentsAssignmentCodeSubmissionsLazyRoute =
  ClassesClassCodeAssignmentsAssignmentCodeSubmissionsLazyImport.update({
    path: '/submissions',
    getParentRoute: () => ClassesClassCodeAssignmentsAssignmentCodeLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes.$classCode.assignments.$assignmentCode.submissions.lazy'
    ).then((d) => d.Route),
  )

const ClassesClassCodeAnnouncementsAnnouncementCodeUpdateLazyRoute =
  ClassesClassCodeAnnouncementsAnnouncementCodeUpdateLazyImport.update({
    path: '/update',
    getParentRoute: () =>
      ClassesClassCodeAnnouncementsAnnouncementCodeLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes.$classCode.announcements.$announcementCode.update.lazy'
    ).then((d) => d.Route),
  )

const ClassesClassCodeModulesModuleCodeLessonsCreateLazyRoute =
  ClassesClassCodeModulesModuleCodeLessonsCreateLazyImport.update({
    path: '/create',
    getParentRoute: () => ClassesClassCodeModulesModuleCodeLessonsLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes.$classCode.modules.$moduleCode.lessons.create.lazy'
    ).then((d) => d.Route),
  )

const ClassesClassCodeModulesModuleCodeLessonsLessonCodeLazyRoute =
  ClassesClassCodeModulesModuleCodeLessonsLessonCodeLazyImport.update({
    path: '/$lessonCode',
    getParentRoute: () => ClassesClassCodeModulesModuleCodeLessonsLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes.$classCode.modules.$moduleCode.lessons.$lessonCode.lazy'
    ).then((d) => d.Route),
  )

const ClassesClassCodeAssignmentsAssignmentCodeSubmissionsSubmissionCodeRoute =
  ClassesClassCodeAssignmentsAssignmentCodeSubmissionsSubmissionCodeImport.update(
    {
      path: '/$submissionCode',
      getParentRoute: () =>
        ClassesClassCodeAssignmentsAssignmentCodeSubmissionsLazyRoute,
    } as any,
  )

const ClassesClassCodeModulesModuleCodeLessonsLessonCodeUpdateLazyRoute =
  ClassesClassCodeModulesModuleCodeLessonsLessonCodeUpdateLazyImport.update({
    path: '/update',
    getParentRoute: () =>
      ClassesClassCodeModulesModuleCodeLessonsLessonCodeLazyRoute,
  } as any).lazy(() =>
    import(
      './routes/classes.$classCode.modules.$moduleCode.lessons.$lessonCode.update.lazy'
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
    '/classes/$classCode': {
      id: '/classes/$classCode'
      path: '/$classCode'
      fullPath: '/classes/$classCode'
      preLoaderRoute: typeof ClassesClassCodeLazyImport
      parentRoute: typeof ClassesLazyImport
    }
    '/classes/$classCode/announcements': {
      id: '/classes/$classCode/announcements'
      path: '/announcements'
      fullPath: '/classes/$classCode/announcements'
      preLoaderRoute: typeof ClassesClassCodeAnnouncementsLazyImport
      parentRoute: typeof ClassesClassCodeLazyImport
    }
    '/classes/$classCode/assignments': {
      id: '/classes/$classCode/assignments'
      path: '/assignments'
      fullPath: '/classes/$classCode/assignments'
      preLoaderRoute: typeof ClassesClassCodeAssignmentsLazyImport
      parentRoute: typeof ClassesClassCodeLazyImport
    }
    '/classes/$classCode/modules': {
      id: '/classes/$classCode/modules'
      path: '/modules'
      fullPath: '/classes/$classCode/modules'
      preLoaderRoute: typeof ClassesClassCodeModulesLazyImport
      parentRoute: typeof ClassesClassCodeLazyImport
    }
    '/classes/$classCode/announcements/$announcementCode': {
      id: '/classes/$classCode/announcements/$announcementCode'
      path: '/$announcementCode'
      fullPath: '/classes/$classCode/announcements/$announcementCode'
      preLoaderRoute: typeof ClassesClassCodeAnnouncementsAnnouncementCodeLazyImport
      parentRoute: typeof ClassesClassCodeAnnouncementsLazyImport
    }
    '/classes/$classCode/announcements/create': {
      id: '/classes/$classCode/announcements/create'
      path: '/create'
      fullPath: '/classes/$classCode/announcements/create'
      preLoaderRoute: typeof ClassesClassCodeAnnouncementsCreateLazyImport
      parentRoute: typeof ClassesClassCodeAnnouncementsLazyImport
    }
    '/classes/$classCode/assignments/$assignmentCode': {
      id: '/classes/$classCode/assignments/$assignmentCode'
      path: '/$assignmentCode'
      fullPath: '/classes/$classCode/assignments/$assignmentCode'
      preLoaderRoute: typeof ClassesClassCodeAssignmentsAssignmentCodeLazyImport
      parentRoute: typeof ClassesClassCodeAssignmentsLazyImport
    }
    '/classes/$classCode/assignments/create': {
      id: '/classes/$classCode/assignments/create'
      path: '/create'
      fullPath: '/classes/$classCode/assignments/create'
      preLoaderRoute: typeof ClassesClassCodeAssignmentsCreateLazyImport
      parentRoute: typeof ClassesClassCodeAssignmentsLazyImport
    }
    '/classes/$classCode/modules/$moduleCode': {
      id: '/classes/$classCode/modules/$moduleCode'
      path: '/$moduleCode'
      fullPath: '/classes/$classCode/modules/$moduleCode'
      preLoaderRoute: typeof ClassesClassCodeModulesModuleCodeLazyImport
      parentRoute: typeof ClassesClassCodeModulesLazyImport
    }
    '/classes/$classCode/modules/create': {
      id: '/classes/$classCode/modules/create'
      path: '/create'
      fullPath: '/classes/$classCode/modules/create'
      preLoaderRoute: typeof ClassesClassCodeModulesCreateLazyImport
      parentRoute: typeof ClassesClassCodeModulesLazyImport
    }
    '/classes/$classCode/announcements/$announcementCode/update': {
      id: '/classes/$classCode/announcements/$announcementCode/update'
      path: '/update'
      fullPath: '/classes/$classCode/announcements/$announcementCode/update'
      preLoaderRoute: typeof ClassesClassCodeAnnouncementsAnnouncementCodeUpdateLazyImport
      parentRoute: typeof ClassesClassCodeAnnouncementsAnnouncementCodeLazyImport
    }
    '/classes/$classCode/assignments/$assignmentCode/submissions': {
      id: '/classes/$classCode/assignments/$assignmentCode/submissions'
      path: '/submissions'
      fullPath: '/classes/$classCode/assignments/$assignmentCode/submissions'
      preLoaderRoute: typeof ClassesClassCodeAssignmentsAssignmentCodeSubmissionsLazyImport
      parentRoute: typeof ClassesClassCodeAssignmentsAssignmentCodeLazyImport
    }
    '/classes/$classCode/assignments/$assignmentCode/update': {
      id: '/classes/$classCode/assignments/$assignmentCode/update'
      path: '/update'
      fullPath: '/classes/$classCode/assignments/$assignmentCode/update'
      preLoaderRoute: typeof ClassesClassCodeAssignmentsAssignmentCodeUpdateLazyImport
      parentRoute: typeof ClassesClassCodeAssignmentsAssignmentCodeLazyImport
    }
    '/classes/$classCode/modules/$moduleCode/lessons': {
      id: '/classes/$classCode/modules/$moduleCode/lessons'
      path: '/lessons'
      fullPath: '/classes/$classCode/modules/$moduleCode/lessons'
      preLoaderRoute: typeof ClassesClassCodeModulesModuleCodeLessonsLazyImport
      parentRoute: typeof ClassesClassCodeModulesModuleCodeLazyImport
    }
    '/classes/$classCode/modules/$moduleCode/update': {
      id: '/classes/$classCode/modules/$moduleCode/update'
      path: '/update'
      fullPath: '/classes/$classCode/modules/$moduleCode/update'
      preLoaderRoute: typeof ClassesClassCodeModulesModuleCodeUpdateLazyImport
      parentRoute: typeof ClassesClassCodeModulesModuleCodeLazyImport
    }
    '/classes/$classCode/assignments/$assignmentCode/submissions/$submissionCode': {
      id: '/classes/$classCode/assignments/$assignmentCode/submissions/$submissionCode'
      path: '/$submissionCode'
      fullPath: '/classes/$classCode/assignments/$assignmentCode/submissions/$submissionCode'
      preLoaderRoute: typeof ClassesClassCodeAssignmentsAssignmentCodeSubmissionsSubmissionCodeImport
      parentRoute: typeof ClassesClassCodeAssignmentsAssignmentCodeSubmissionsLazyImport
    }
    '/classes/$classCode/modules/$moduleCode/lessons/$lessonCode': {
      id: '/classes/$classCode/modules/$moduleCode/lessons/$lessonCode'
      path: '/$lessonCode'
      fullPath: '/classes/$classCode/modules/$moduleCode/lessons/$lessonCode'
      preLoaderRoute: typeof ClassesClassCodeModulesModuleCodeLessonsLessonCodeLazyImport
      parentRoute: typeof ClassesClassCodeModulesModuleCodeLessonsLazyImport
    }
    '/classes/$classCode/modules/$moduleCode/lessons/create': {
      id: '/classes/$classCode/modules/$moduleCode/lessons/create'
      path: '/create'
      fullPath: '/classes/$classCode/modules/$moduleCode/lessons/create'
      preLoaderRoute: typeof ClassesClassCodeModulesModuleCodeLessonsCreateLazyImport
      parentRoute: typeof ClassesClassCodeModulesModuleCodeLessonsLazyImport
    }
    '/classes/$classCode/modules/$moduleCode/lessons/$lessonCode/update': {
      id: '/classes/$classCode/modules/$moduleCode/lessons/$lessonCode/update'
      path: '/update'
      fullPath: '/classes/$classCode/modules/$moduleCode/lessons/$lessonCode/update'
      preLoaderRoute: typeof ClassesClassCodeModulesModuleCodeLessonsLessonCodeUpdateLazyImport
      parentRoute: typeof ClassesClassCodeModulesModuleCodeLessonsLessonCodeLazyImport
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
    ClassesClassCodeLazyRoute: ClassesClassCodeLazyRoute.addChildren({
      ClassesClassCodeAnnouncementsLazyRoute:
        ClassesClassCodeAnnouncementsLazyRoute.addChildren({
          ClassesClassCodeAnnouncementsAnnouncementCodeLazyRoute:
            ClassesClassCodeAnnouncementsAnnouncementCodeLazyRoute.addChildren({
              ClassesClassCodeAnnouncementsAnnouncementCodeUpdateLazyRoute,
            }),
          ClassesClassCodeAnnouncementsCreateLazyRoute,
        }),
      ClassesClassCodeAssignmentsLazyRoute:
        ClassesClassCodeAssignmentsLazyRoute.addChildren({
          ClassesClassCodeAssignmentsAssignmentCodeLazyRoute:
            ClassesClassCodeAssignmentsAssignmentCodeLazyRoute.addChildren({
              ClassesClassCodeAssignmentsAssignmentCodeSubmissionsLazyRoute:
                ClassesClassCodeAssignmentsAssignmentCodeSubmissionsLazyRoute.addChildren(
                  {
                    ClassesClassCodeAssignmentsAssignmentCodeSubmissionsSubmissionCodeRoute,
                  },
                ),
              ClassesClassCodeAssignmentsAssignmentCodeUpdateLazyRoute,
            }),
          ClassesClassCodeAssignmentsCreateLazyRoute,
        }),
      ClassesClassCodeModulesLazyRoute:
        ClassesClassCodeModulesLazyRoute.addChildren({
          ClassesClassCodeModulesModuleCodeLazyRoute:
            ClassesClassCodeModulesModuleCodeLazyRoute.addChildren({
              ClassesClassCodeModulesModuleCodeLessonsLazyRoute:
                ClassesClassCodeModulesModuleCodeLessonsLazyRoute.addChildren({
                  ClassesClassCodeModulesModuleCodeLessonsLessonCodeLazyRoute:
                    ClassesClassCodeModulesModuleCodeLessonsLessonCodeLazyRoute.addChildren(
                      {
                        ClassesClassCodeModulesModuleCodeLessonsLessonCodeUpdateLazyRoute,
                      },
                    ),
                  ClassesClassCodeModulesModuleCodeLessonsCreateLazyRoute,
                }),
              ClassesClassCodeModulesModuleCodeUpdateLazyRoute,
            }),
          ClassesClassCodeModulesCreateLazyRoute,
        }),
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
        "/classes/$classCode"
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
    "/classes/$classCode": {
      "filePath": "classes.$classCode.lazy.tsx",
      "parent": "/classes",
      "children": [
        "/classes/$classCode/announcements",
        "/classes/$classCode/assignments",
        "/classes/$classCode/modules"
      ]
    },
    "/classes/$classCode/announcements": {
      "filePath": "classes.$classCode.announcements.lazy.tsx",
      "parent": "/classes/$classCode",
      "children": [
        "/classes/$classCode/announcements/$announcementCode",
        "/classes/$classCode/announcements/create"
      ]
    },
    "/classes/$classCode/assignments": {
      "filePath": "classes.$classCode.assignments.lazy.tsx",
      "parent": "/classes/$classCode",
      "children": [
        "/classes/$classCode/assignments/$assignmentCode",
        "/classes/$classCode/assignments/create"
      ]
    },
    "/classes/$classCode/modules": {
      "filePath": "classes.$classCode.modules.lazy.tsx",
      "parent": "/classes/$classCode",
      "children": [
        "/classes/$classCode/modules/$moduleCode",
        "/classes/$classCode/modules/create"
      ]
    },
    "/classes/$classCode/announcements/$announcementCode": {
      "filePath": "classes.$classCode.announcements.$announcementCode.lazy.tsx",
      "parent": "/classes/$classCode/announcements",
      "children": [
        "/classes/$classCode/announcements/$announcementCode/update"
      ]
    },
    "/classes/$classCode/announcements/create": {
      "filePath": "classes.$classCode.announcements.create.lazy.tsx",
      "parent": "/classes/$classCode/announcements"
    },
    "/classes/$classCode/assignments/$assignmentCode": {
      "filePath": "classes.$classCode.assignments.$assignmentCode.lazy.tsx",
      "parent": "/classes/$classCode/assignments",
      "children": [
        "/classes/$classCode/assignments/$assignmentCode/submissions",
        "/classes/$classCode/assignments/$assignmentCode/update"
      ]
    },
    "/classes/$classCode/assignments/create": {
      "filePath": "classes.$classCode.assignments.create.lazy.tsx",
      "parent": "/classes/$classCode/assignments"
    },
    "/classes/$classCode/modules/$moduleCode": {
      "filePath": "classes.$classCode.modules.$moduleCode.lazy.tsx",
      "parent": "/classes/$classCode/modules",
      "children": [
        "/classes/$classCode/modules/$moduleCode/lessons",
        "/classes/$classCode/modules/$moduleCode/update"
      ]
    },
    "/classes/$classCode/modules/create": {
      "filePath": "classes.$classCode.modules.create.lazy.tsx",
      "parent": "/classes/$classCode/modules"
    },
    "/classes/$classCode/announcements/$announcementCode/update": {
      "filePath": "classes.$classCode.announcements.$announcementCode.update.lazy.tsx",
      "parent": "/classes/$classCode/announcements/$announcementCode"
    },
    "/classes/$classCode/assignments/$assignmentCode/submissions": {
      "filePath": "classes.$classCode.assignments.$assignmentCode.submissions.lazy.tsx",
      "parent": "/classes/$classCode/assignments/$assignmentCode",
      "children": [
        "/classes/$classCode/assignments/$assignmentCode/submissions/$submissionCode"
      ]
    },
    "/classes/$classCode/assignments/$assignmentCode/update": {
      "filePath": "classes.$classCode.assignments.$assignmentCode.update.lazy.tsx",
      "parent": "/classes/$classCode/assignments/$assignmentCode"
    },
    "/classes/$classCode/modules/$moduleCode/lessons": {
      "filePath": "classes.$classCode.modules.$moduleCode.lessons.lazy.tsx",
      "parent": "/classes/$classCode/modules/$moduleCode",
      "children": [
        "/classes/$classCode/modules/$moduleCode/lessons/$lessonCode",
        "/classes/$classCode/modules/$moduleCode/lessons/create"
      ]
    },
    "/classes/$classCode/modules/$moduleCode/update": {
      "filePath": "classes.$classCode.modules.$moduleCode.update.lazy.tsx",
      "parent": "/classes/$classCode/modules/$moduleCode"
    },
    "/classes/$classCode/assignments/$assignmentCode/submissions/$submissionCode": {
      "filePath": "classes.$classCode.assignments.$assignmentCode.submissions.$submissionCode.tsx",
      "parent": "/classes/$classCode/assignments/$assignmentCode/submissions"
    },
    "/classes/$classCode/modules/$moduleCode/lessons/$lessonCode": {
      "filePath": "classes.$classCode.modules.$moduleCode.lessons.$lessonCode.lazy.tsx",
      "parent": "/classes/$classCode/modules/$moduleCode/lessons",
      "children": [
        "/classes/$classCode/modules/$moduleCode/lessons/$lessonCode/update"
      ]
    },
    "/classes/$classCode/modules/$moduleCode/lessons/create": {
      "filePath": "classes.$classCode.modules.$moduleCode.lessons.create.lazy.tsx",
      "parent": "/classes/$classCode/modules/$moduleCode/lessons"
    },
    "/classes/$classCode/modules/$moduleCode/lessons/$lessonCode/update": {
      "filePath": "classes.$classCode.modules.$moduleCode.lessons.$lessonCode.update.lazy.tsx",
      "parent": "/classes/$classCode/modules/$moduleCode/lessons/$lessonCode"
    }
  }
}
ROUTE_MANIFEST_END */
