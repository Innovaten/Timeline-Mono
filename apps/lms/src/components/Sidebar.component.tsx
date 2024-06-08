import { AdjustmentsVerticalIcon, CalendarIcon, PaperClipIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon, MegaphoneIcon, InformationCircleIcon, FolderIcon, HomeIcon } from '@heroicons/react/24/outline'

import { useLMSContext } from "../main";
import { Link } from "@tanstack/react-router";


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
        label: "Calendar",
        path: "/calendar",
        icon: CalendarIcon,
    },
    
]

const classes = [
    {
        id: 'clasnaksd39jf90j',
        code: "SAT00001",
        title: "SAT AUG 2024"
    },
    {
        id: 'kalsdfkalskdn',
        code: "SAT00002",
        title: "SAT SEPT 2024"
    },
    {
        id: 'woijoi3j09jjfvio',
        code: "SAT00003",
        title: "ACT JAN 2025"
    },
    
]

const classesTabs = [
    {
        title: "Lessons",
        path: "lessons",
        icon: BookOpenIcon,    
    },
    {
        title: "Resources",
        path: "resources",
        icon: FolderIcon,    
    },
    {
        title: "Assignments",
        path: "assignments",
        icon: PaperClipIcon,    
    },
    {
        title: "Quizzes",
        path: "quizzes",
        icon: PencilSquareIcon,    
    },
    {
        title: "Settings",
        path: "settings",
        icon: AdjustmentsVerticalIcon,
    },
]

export default function SidebarComponent(){
    const user = useLMSContext((state) => state.user);

    return (
        <>
            <div className="h-full flex flex-col gap-2 justify-between w-1/4 min-w-[150px] max-w-[250px]">
                <div className="flex-1">
                    <img className="h-[50px] m-auto" src="/img/timeline-logo.png" />
                    <div className="mt-8">
                        <small className="text-blue-600">MENU</small>
                        <div className="mt-2 flex flex-col gap-4">
                            {
                                menuTabs.map(({label, icon, path }, idx) => {
                                    const MenuIcon = icon;

                                    return (
                                        <Link to={path} key={idx} className="flex gap-4 items-center bg-white hover:bg-blue-100/10 duration-150 pl-4 py-4 rounded shadow-sm text-blue-600">
                                            <MenuIcon className="w-5" />
                                            <p>{label}</p>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="mt-8">
                        <small className="text-blue-600">CLASSES</small>
                        <div className="mt-2 flex flex-col gap-4">
                            {
                                classes.map(({title, code }, idx) => {
                                    
                                    return (
                                        <div className="group duration-150">
                                            <Link to={`/class/${code}`} key={idx} className="flex gap-4 items-center bg-white hover:bg-blue-100/10 duration-150 pl-4 py-4 rounded shadow-sm text-blue-600">
                                                <BookOpenIcon className="w-5" />
                                                <p>{title}</p>
                                            </Link>
                                            <div className="h-0 overflow-hidden group-hover:h-fit bg-white/50 gap-2 flex flex-col duration-150">
                                                { classesTabs.map(({ title: tabTitle, path, icon }, idx) => {
                                                    const TabIcon = icon;

                                                    return (
                                                        <Link to={`/class/${code}/${path}`} key={idx} className="flex pl-4 py-4 text-blue-600 hover:bg-blue-400/10 duration-150 items-center gap-4">
                                                            <TabIcon className="w-5" />
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
                <div className="flex flex-col gap-4">
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