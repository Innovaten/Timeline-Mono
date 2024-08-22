import { useAdministratorsFilter, useAdministrators } from "./administrators.hook"
import { useRegistrants, useRegistrantsFilter } from "./registrations.hook"
import { useClasses, useClass } from "./classes.hook"
import { useAdminsCount, useClassesCount, usePendingCount, useStudentsCount, useAnnouncementsCount} from "./resourcesCount.hook"
import useCompositeFilterFlag from "./composite-filter.hook"
import { useMobileNavigation } from "@repo/utils"
import { useAnnouncements, useAnnouncement, useAnnouncementStateFilter, useAnnouncementsByClass, useAnnouncementsCountByClass } from "./announcements.hook,"
import { useLessons, useLesson } from "./lessons.hook"
import { useModules, useModule, useModuleStateFilter, classModuleCount } from "./modules.hook"
import { useSpecificEntity } from "./common.hook"
import { useAssignment, useAssignmentStateFilter, useAssignments, useAssignmentsByClass, useAssignmentSubmission, useAssignmentSubmissions, useAssignmentSubmissionStatusFilter, } from "./assignment.hook"
import { useStudents, useStudentsInClass } from "./students.hook"
export {

    useRegistrants,
    useRegistrantsFilter,
    useAdministrators,
    useAdministratorsFilter,
    useClasses,
    useClass,
    useCompositeFilterFlag,
    useMobileNavigation,
    useAdminsCount,
    useClassesCount,
    usePendingCount,
    useStudentsCount,
    useAnnouncements,
    useAnnouncementsByClass,
    useAnnouncementsCountByClass,
    useAnnouncement,
    useAnnouncementStateFilter,
    useSpecificEntity,
    useAnnouncementsCount,
    useLessons,
    useLesson,
    useModules,
    useModule,    
    useModuleStateFilter,
    useAssignment,
    useAssignmentStateFilter,
    useAssignments,
    useAssignmentsByClass,
    useAssignmentSubmission,
    useAssignmentSubmissions,
    useAssignmentSubmissionStatusFilter,
    useStudents,
    useStudentsInClass,
    classModuleCount
}