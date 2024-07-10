import { useAdministratorsFilter, useAdministrators } from "./administrators.hook"
import { useRegistrations } from "./registrations.hook"
import { useClasses } from "./classes.hook"
import { useAdminsCount, useClassesCount, usePendingCount, useStudentsCount} from "./resourcesCount.hook"
import useCompositeFilterFlag from "./composite-filter.hook"
import { useMovileNavigation } from "@repo/utils"

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
    useStudentsCount

}