import { AdjustmentsVerticalIcon, BookOpenIcon, CalendarIcon, FolderIcon, HomeIcon, MegaphoneIcon, PaperClipIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
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
            <div className="h-full flex flex-col justify-between w-1/4 min-w-[150px] max-w-[250px]">
                <div>
                    <img className="h-[50px] m-auto" src="/img/timeline-logo.png" />
                    <div className="mt-8">
                        <small className="text-blue-600">MENU</small>
                        <div className="mt-2 flex flex-col gap-4">
                            {
                                menuTabs.map(({label, icon, path }, idx) => {
                                    const MenuIcon = icon;

                                    return (
                                        <Link to={path} key={idx} className="flex gap-4 items-center bg-white pl-4 py-4 rounded shadow-sm text-blue-600">
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
                                            <div className="hidden group-hover:flex bg-white/50 gap-2 flex-col duration 150">
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
                <div>

                </div>
            </div>
        </>
    )

}