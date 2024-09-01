import {
    createLazyFileRoute,
    useRouterState,
    Outlet,
    Link,
  } from "@tanstack/react-router";
  import { _getToken } from "@repo/utils";
  import dayjs from "dayjs";
  import { useModule, useLessons } from "../../../../../hooks";
  import { useLMSContext } from "../../../../../app";
  
  export const Route = createLazyFileRoute(
    "/classes/$classCode/modules/$moduleCode/lessons"
  )({
    component: Lessons,
  });
  
  function Lessons() {
    const routerState = useRouterState();
    const { classCode, moduleCode } = Route.useParams();
    const { user } = useLMSContext();
  
    if (
      routerState.location.pathname !==
      `/classes/${classCode}/modules/${moduleCode}/lessons`
    ) {
      return <Outlet />;
    }
  
    //const { isLoading, module } = useModule(true, moduleCode, false);
    const {
      lessons,
      isLoading: lessonsIsLoading,
      count: lessonsCount,
    } = useLessons(true, 10, 0, { moduleCode: moduleCode });
  
    
    return (
      <div className="flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1">
        {lessonsIsLoading && (
          <div className="w-full h-full m-auto mt-4">
            <div className="w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin"></div>
          </div>
        )}
  
        {!lessonsIsLoading && (
            <div className="w-full flex-1 mt-2 sm:mt-8 bg-blue-50 p-1 rounded-sm shadow">
              <div className="bg-white w-full overflow-auto h-full flex flex-col rounded">
                <div className="w-full text-blue-700 py-2 px-1 sm:px-3 bg-blue-50 border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex-1 font-normal truncate">LESSONS</span>
                  </div>
                  <div className="flex gap-4 items-center font-light">
                    <span className="w-[150px] hidden sm:flex justify-end">
                      AUTHOR
                    </span>
                    <span className="w-[150px] hidden sm:flex justify-end">
                      DATE CREATED
                    </span>
                  </div>
                </div>
                {!lessonsIsLoading &&
                  lessons.map((lesson, idx) => {
                    return (
                      <Link
                        to={`/classes/${classCode}/modules/${moduleCode}/lessons/${lesson.code}`}
                        key={idx}
                        className="cursor-pointer w-full text-blue-700 py-2 px-1 sm:px-3 bg-white border-b-[0.5px] border-b-blue-700/40 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-200/10"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex-1 font-normal truncate">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex gap-4 items-center font-light">
                          <span className="w-[150px] hidden sm:flex justify-end">
                            {lesson.createdBy.firstName +
                              " " +
                              lesson.createdBy.lastName}
                          </span>
                          <span className="w-[150px] hidden sm:flex justify-end">
                            {dayjs(lesson.createdAt).format("HH:mm - DD/MM/YY")}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
        )}
      </div>
    );
  }
  