import { PaperClipIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon, MegaphoneIcon, InformationCircleIcon, HomeIcon, XMarkIcon, Bars2Icon, NewspaperIcon } from '@heroicons/react/24/outline'

import { useLMSContext } from "../app";
import { Link, useRouterState } from "@tanstack/react-router";
import { useMovileNavigation } from "@repo/utils";
const menuTabs = [
    {
        label: "Home",
        path: "/",
        icon: HomeIcon,
    },
    {
        label: "Announcements",
        path: "/announcements",
        icon: MegaphoneIcon,
    },
    {
        label: "Assignments",
        path: "/assignments",
        icon: NewspaperIcon,
    },
    {
        label: "Classes",
        path: "/classes",
        icon: BookOpenIcon,
    },
    
]

const classes = [
    {
        id: 'clasnaksd39jf90j',
        code: "SAT00001",
        title: "SAT"
    },
    {
        id: 'kalsdfkalskdn',
        code: "GMAT00002",
        title: "GMAT"
    },
    {
        id: 'woijoi3j09jjfvio',
        code: "ACT00003",
        title: "ACT"
    },
    
]

const classesTabs = [
    {
        title: "Lessons",
        path: "lessons",
        icon: BookOpenIcon,    
    },
    {
        title: "Assignments",
        path: "assignments",
        icon: PaperClipIcon,    
    },
    // {
    //     title: "Quizzes",
    //     path: "quizzes",
    //     icon: PencilSquareIcon,    
    // },
    // {
    //     title: "Settings",
    //     path: "settings",
    //     icon: AdjustmentsVerticalIcon,
    // },
]

export default function SidebarComponent(){
    const user = useLMSContext((state) => state.user);
    const routerState = useRouterState();
    const { navIsOpen, toggleNav } = useMovileNavigation(routerState.location.pathname);

    return (
        <>
        {/* Movile Nav Header */}
            <div className="z-50 flex sm:hidden w-[100vw] items-center px-4 justify-between bg-white shadow h-[60px] top-0 fixed">
                <img className="h-[35px]" src="/img/timeline-logo.png" />
                {
                    navIsOpen ?
                    <XMarkIcon className="w-5 text-blue-900" onClick={toggleNav} />
                    :
                    <Bars2Icon className="w-5 text-blue-900" onClick={toggleNav} />

                }
            </div>
            <div className={` ${ !navIsOpen && "hidden" } bg-blue-50 px-4 sm:p-0 z-40 fixed sm:static h-full sm:flex flex-col gap-2 sm:justify-between w-full sm:w-[150px] xl:w-[250px]`}>
                <div className="sm:flex-1 sm:overflow-auto">
                    <img className="h-[40px] m-auto" src="/img/timeline-logo.png" />
                    <div className="mt-12 sm:mt-6">

                        <small className="text-blue-600">MENU</small>
                        <div className="mt-2 flex flex-col gap-2">
                            {
                                menuTabs.map(({label, icon, path }, idx) => {
                                    const MenuIcon = icon;

                                    return (
                                        <Link to={path} key={idx} className={`flex gap-4 items-center ${ routePathIsEqual(path) ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-white hover:bg-blue-400/10 text-blue-600' }  duration-150 pl-4 py-4 rounded shadow-sm truncate`}>
                                            <MenuIcon className="w-5" />
                                            <p>{label}</p>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-8 sm:mt-0">
                    <Link to='/' className="flex gap-4 items-center bg-white pl-4 py-4 rounded shadow-sm text-blue-600">
                        <InformationCircleIcon className="w-5" />
                        <p>SUPPORT</p>
                    </Link>
                    <Link to='/' className="flex gap-4 items-center bg-white pl-4 py-4 rounded shadow-sm text-blue-600">
                        <div className="w-10 aspect-square rounded-full border-[1px] border-blue-600 grid place-items-center">
                            { ( user?.firstName[0] || "N") + (user?.lastName[0] || "A" ) }
                        </div>
                        <div className="truncate">
                            <p>{(user?.firstName || "Test") + " " + (user?.lastName || "User")}</p>
                            <small>{user?.email || "kwabena@kodditor.co"}</small>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )

}

function routePathIsEqual(path: string){
    return useRouterState().location.pathname == path;
}