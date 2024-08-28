import {
  createLazyFileRoute,
  useRouterState,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { Button } from "@repo/ui";
import { _getToken, makeAuthenticatedRequest } from "@repo/utils";
import dayjs from "dayjs";
import { useLesson } from "../hooks";
import {
  PhotoIcon,
  DocumentIcon,
  PaperClipIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { useLMSContext } from "../app";
import { toast } from "sonner";

export const Route = createLazyFileRoute(
  "/classes/$classCode/modules/$moduleCode/$lessonCode"
)({
  component: Lesson,
});

function Lesson() {
  const routerState = useRouterState();
  const { classCode, moduleCode, lessonCode } = Route.useParams();
  const { user } = useLMSContext();

  if (
    routerState.location.pathname !==
    `/classes/${classCode}/modules/${moduleCode}/${lessonCode}`
  ) {
    return <Outlet />;
  }

  function markAsComplete() {
    makeAuthenticatedRequest(
      "post",
      `/api/v1/users/${user?._id}/completed-lessons/${lesson?._id}`,
      {
        lessonSetId: lesson?.lessonSet._id,
      }
    )
      .then((res) => {
        if (res.status == 201 && res.data.success) {
          toast.success(
            <p>Lesson has been marked as completed successfully.</p>
          );
        } else {
          toast.error(`${res.data.error.msg}`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`${err}`);
      });
  }

  function markAsUncompleted() {
    makeAuthenticatedRequest(
      "post",
      `/api/v1/users/${user?._id}/completed-lessons/${lesson?._id}`,
      {
        lessonSetId: lesson?.lessonSet._id,
      }
    )
      .then((res) => {
        if (res.status == 201 && res.data.success) {
          toast.success(<p>Lesson has been unmarked successfully.</p>);
        } else {
          toast.error(`${res.data.error.msg}`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`${err}`);
      });
  }

  const { isLoading, lesson } = useLesson(true, lessonCode);
  return (
    <div className="flex flex-col w-full h-[calc(100vh-6rem)] sm:h-full flex-1">
      {isLoading && (
        <div className="w-full h-full m-auto mt-4">
          <div className="w-5 aspect-square m-auto rounded-full border-[1px] border-t-blue-500 animate-spin"></div>
        </div>
      )}

      {!isLoading && lesson && (
        <div className="flex flex-col gap-2 flex-1">
          <div className="mt-2">
            <h3 className="text-blue-800">{lesson.title}</h3>
            <span className="mt-3 flex gap-2 flex-wrap items-center">
              <span className="bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm">
                <span>Author:</span>
                <span className="font-light">
                  {lesson.createdBy?.firstName +
                    " " +
                    lesson.createdBy?.lastName}
                </span>
              </span>
              <span className="bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm">
                <span>Created:</span>
                <span className="font-light">
                  {dayjs(lesson.createdAt).format("HH:mm - DD/MM/YY")}
                </span>
              </span>

              {lesson.createdAt != lesson.updatedAt && (
                <span className="bg-blue-300/10 border-blue-600/10 border-[1.5px] flex gap-1 items-center text-blue-700 rounded px-2 py-1 shadow-sm">
                  <span>Updated:</span>
                  <span className="font-light">
                    {dayjs(lesson.updatedAt).format("HH:mm - DD/MM/YY")}
                  </span>
                </span>
              )}
            </span>
          </div>
          <div className="pt-5">
            <span className="mt-4 text-blue-700 font-light">Content</span>
            <div
              className="flex-1 overflow-y-auto text-blue-700"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            ></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-end ">
            {lesson.resources && (
              <div className="flex-1 mt-14">
                <span className="mt-4 text-blue-700 font-light">Resources</span>
                <div className="mt-2 grid grid-cols-1 text-blue-700 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-2">
                  {lesson.resources &&
                    lesson.resources.length > 0 &&
                    lesson.resources.map((resource, idx) => {
                      return (
                        <a
                          className="flex max-w-[200px] gap-2 p-2 rounded-sm bg-blue-300/10 border-[1.5px] border-blue-600/10 "
                          target="_blank"
                          href={resource.link}
                          key={idx}
                        >
                          {resource.type == "Image" && (
                            <PhotoIcon className="w-4 shrink-0" />
                          )}
                          {resource.type == "Document" && (
                            <DocumentIcon className="w-4 shrink-0" />
                          )}
                          {resource.type == "Link" && (
                            <ShareIcon className="w-4 shrink-0" />
                          )}
                          {resource.type == "Other" && (
                            <PaperClipIcon className="w-4 shrink-0" />
                          )}
                          <p className="font-light truncate">
                            {decodeURIComponent(resource.title)}
                          </p>
                        </a>
                      );
                    })}
                  {(!lesson.resources || lesson.resources.length == 0) && (
                    <div className="flex gap-2 p-2 rounded-sm bg-blue-300/10 border-[1.5px] border-blue-600/10 sm:w-36">
                      <PaperClipIcon className="w-4 shrink-0" />
                      <p className="font-light">No resources</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="w-full sm:w-fit shrink-0 flex flex-col sm:flex-row gap-2">
              <Link className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={markAsUncompleted}
                >
                  Mark uncompleted
                </Button>
              </Link>
              <Link className="w-full">
                <Button
                  className="w-full sm:!w-[150px]"
                  onClick={markAsComplete}
                >
                  Mark completed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
