import { PaperClipIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon, MegaphoneIcon, InformationCircleIcon, HomeIcon, XMarkIcon, Bars2Icon, NewspaperIcon, PowerIcon } from '@heroicons/react/24/outline'
import { useMemo } from "react";
import { useLMSContext } from "../app";
import { Link, useRouterState } from "@tanstack/react-router";
import { _clearTokens, useMobileNavigation } from "@repo/utils";
import { useClasses } from "../hooks/classes.hooks";
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
    const { navIsOpen, toggleNav } = useMobileNavigation(routerState.location.pathname);
    // const userId = useMemo(() => user?.id, [user?.id]);
    //const { classes: userClasses, isLoading } = useClasses(user?.id);


    return (
        <>
        {/* Mobile Nav Header */}
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

                    <div className="mt-4">
                        <small className="text-blue-600">CLASSES</small>
                        <div className="mt-2 flex flex-col gap-2">
                            {
                                classes.map(({title, code }, index) => {
                                    
                                    return (
                                        <div className="group duration-150" key={index}>
                                            <Link to={`/classes/${code}`} className={`flex gap-4 items-center ${ routePathIsEqual(`/classes/${code}`) ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-white hover:bg-blue-400/10 text-blue-600' } duration-150 pl-4 py-4 rounded shadow-sm`}>
                                                <BookOpenIcon className="w-5" />
                                                <p>{title}</p>
                                            </Link>
                                            <div className="h-0 rounded-b shadow-sm overflow-hidden group-hover:h-fit bg-white/50 flex flex-col duration-150">
                                                { classesTabs.map(({ title: tabTitle, path, icon }, idx) => {
                                                    const TabIcon = icon;

                                                    return (
                                                        <Link to={`/classes/${code}/${path}`} key={idx} className={`flex pl-4 py-2 ${ routePathIsEqual(`/classes/${code}/${path}`) ? 'bg-blue-700 text-white border-b-[1px] border-bg-blue-600 hover:bg-blue-600' : 'bg-white border-b-[1px] border-b-blue-400/10 hover:bg-blue-400/10 text-blue-600' } duration-150 items-center gap-4 truncate`}>
                                                            <TabIcon className="w-4" />
                                                            {tabTitle}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-8 sm:mt-0">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Link search={{ destination: ""}} onClick={()=>{_clearTokens()}} to="/login" className="w-full flex gap-2 items-center  bg-white pl-4 py-4 rounded shadow-sm text-blue-600">
                            <PowerIcon className="w-5 sm:w-4" />
                            <p>LOGOUT</p>
                        </Link>
                        <Link to='/' className="flex w-full gap-2 items-center bg-white pl-4 py-4 rounded shadow-sm text-blue-600">
                            <InformationCircleIcon className="w-5 sm:w-4" />
                            <p>SUPPORT</p>
                        </Link>
                    </div>
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