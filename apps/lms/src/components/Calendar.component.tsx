import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cn } from "@repo/utils";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";

type CalendarEvent = {
    title: string,
    class: string,
    description: string,
    url: string,
}

type CalendarComponentProps = {
    events?: Record<string, CalendarEvent>
}

export default function CalendarComponent({ events }: CalendarComponentProps){

    const [ currentDate, setCurrentDate ] = useState<Date>(new Date());

    const weekdayNumOfStartOfMonth = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).day();
    const numDaysInLastMonth = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)).daysInMonth();
    const numDaysInCurrentMonth = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).daysInMonth();

    const weekdayNumOfEndOfMonth = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), numDaysInCurrentMonth)).day();

    const eventsInThisMonth: Record<string, CalendarEvent> = {};
    if(events) {
        Object.keys(events).filter( a => new Date(a).getMonth() == currentDate.getMonth()).map((a) => {
            eventsInThisMonth[a] = events[a];
        })
    }

    const datesOfEventsThisMonth = Object.keys(eventsInThisMonth).map((date) => new Date(date).getDate())

    return (
        <div className='w-full h-fit bg-blue-50 p-1 rounded-sm shadow-sm mt-2'>
            <div className='bg-white w-full h-full rounded p-3'>
            <div className='flex w-full justify-between items-center bg-blue-50 p-1 rounded-full'>
                <button className='w-6 aspect-square flex items-center justify-center rounded-full bg-white hover:bg-blue-400/10 duration-150 cursor-pointer' onClick={() => { setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getUTCDate()))}}><ArrowLeftIcon className='w-4'/></button>
                <span className='text-md'>{dayjs.months()[currentDate.getMonth()]}</span>
                <button className='w-6 aspect-square flex items-center justify-center rounded-full bg-white hover:bg-blue-400/10 duration-150 cursor-pointer' onClick={() => { setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getUTCDate()))}}><ArrowRightIcon className='w-4'/></button>
            </div>
            <div className='grid grid-cols-7 place-items-center gap-y-2 gap-x-8 py-2 flex-1 w-full'> 
                {   // S M T W T F S
                    new Array(7).fill(0).map((_, idx) => {
                        return (
                        <div className='mb-2 font-semibold' key={idx}>{dayjs.weekdays()[idx][0]}</div>
                        )
                    })
                }
                {  // Days from last month
                    new Array(weekdayNumOfStartOfMonth).fill(0).map((_, idx) => {
                        return (
                            <div className='bg-slate-100 grid place-items-center font-semibold text-slate-300 rounded-full w-8 aspect-square cursor-default' key={idx}>
                            {
                                numDaysInLastMonth + 1 - (weekdayNumOfStartOfMonth - idx) // Herh charle 
                            }
                            </div>
                        )
                    }) 
                }
                { // Days in this month
                    new Array(numDaysInCurrentMonth).fill(0).map((_, idx) => {
                        return (
                            <div
                            onClick={ () => {} }
                            // Trigger popup with event details
                                className={ cn(
                                    'hover:bg-blue-100 cursor-pointer duration-150 grid place-items-center text-blue-700 rounded-full w-8 aspect-square',
                                    ( datesOfEventsThisMonth.includes(idx + 1) ? "bg-blue-100 border-[1px] border-blue-200 hover:bg-blue-200" : ""  ),
                                    ( currentDate.getDate() == (idx + 1) ) && (currentDate.getMonth() == new Date().getMonth()) && (currentDate.getFullYear() == new Date().getFullYear()) ? "border-[1px] border-blue-700" : "",
                                )}  
                                key={idx + 1}>
                                { idx + 1 }
                            </div>
                        )
                    })
                }
                { // Days in next month 
                    new Array( 6 - weekdayNumOfEndOfMonth).fill(0).map((_, idx) => {
                        return (
                            <div className='bg-slate-100 grid place-items-center font-semibold text-slate-300 rounded-full w-8 aspect-square cursor-default' key={idx}>
                            { idx + 1 }
                            </div>
                        )
                    }) 
                }
                </div>
            </div>
        </div>
    )
}