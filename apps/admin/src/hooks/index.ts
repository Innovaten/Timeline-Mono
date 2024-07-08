import { useAdministratorsFilter, useAdministrators } from "./administrators.hook"
import { useRegistrations } from "./registrations.hook"
import { useClasses } from "./classes.hook"
import { useAdminsCount, useClassesCount, usePendingCount, useStudentsCount} from "./resourcesCount.hook"
import useCompositeFilterFlag from "./composite-filter.hook"

export {

    useRegistrations,
    useAdministrators,
    useAdministratorsFilter,
    useClasses,
    useCompositeFilterFlag,
    useAdminsCount,
    useClassesCount,
    usePendingCount,
    useStudentsCount

}