import { useAdministratorsFilter, useAdministrators } from "./administrators.hook"
import { useRegistrations } from "./registrations.hook"
import { useClasses } from "./classes.hook"
import { useAdminsCount, useClassesCount, usePendingCount, useStudentsCount} from "./resourcesCount.hook"
import useCompositeFilterFlag from "./composite-filter.hook"
import { useMovileNavigation } from "@repo/utils"
import { useAnnouncements } from "./announcements.hook,"
import { useSpecificEntity } from "./common.hook"
export {

    useRegistrations,
    useAdministrators,
    useAdministratorsFilter,
    useClasses,
    useCompositeFilterFlag,
    useMovileNavigation,
    useAdminsCount,
    useClassesCount,
    usePendingCount,
    useStudentsCount,
    useAnnouncements,
    useSpecificEntity,
    
}