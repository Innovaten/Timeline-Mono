import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'

export const Route = createLazyFileRoute('/announcements')({
  component: () => <Announcements />
})



const announcememnts = [
  {
    title: 'Assignment Update',
    class: 'SAT SEPT 2024',
    date: '17:25 - 4 Jun',
  },
  {
    title: 'SAT Trial Quiz',
    class: 'SAT SEPT 2024',
    date: '11:32 - 2 Jun',
  },
  {
    title: 'New Assignment',
    class: 'SAT AUG 2024',
    date: '12:47 - 25 May',
  },
  {
    title: 'Farewell Announcement',
    class: 'SAT MAR 2024',
    date: '8:24 - 29 Mar',
  },
]

  const dropdownItems = [
  {
    option1: 'Today',
    option2: 'Last Week',
    option3: 'Last Month'
  },
]

function Announcements({}){

  return (
    <>
     {/* Title */}
     <div>
      <h1 className='text-blue-900'>Announcements</h1>
     </div>
     {/* Filters */}
     <div className='flex justify-between'>
      <Dropdown buttonText = 'All Announcements' options = {dropdownItems}/>
      <div className='flex'>
        <Dropdown buttonText = 'All Classes' options = {dropdownItems}/>
        <Dropdown buttonText = 'This Year' options = {dropdownItems}/>
      </div>
     </div>
     {/* Main Announcements */}
     <div className='border-4 border-blue-50 rounded-md flex-1 px-1' >
        {announcememnts.map(( announcememnt, index) => (
        <div key = {index} className='flex items-center p-1 h-15 bg-blue-50 justify-between mx-1 mt-1 mb-1'>
          <div className='w-9/12'>
            <button className='ml-2 text-blue-800 hover:underline'>{announcememnt.title}</button>
          </div>
          <div className='justify-between w-3/12 mr-2 items-center flex'>
            <button className='text-blue-800 '>{announcememnt.class}</button>
            <button className='text-blue-800'>{announcememnt.date}</button>
            <div className='w-1.5 h-1.5 bg-blue-600 rounded-full'></div>
          </div>
      </div>
      ))}
     </div>
     <div className='flex justify-end mt-1' >
      <span className='text-xs text-blue-600 justify-end'>Showing <span className='text-xs text-blue-800 font-bold'>{(announcememnts.length)}</span> out of <span className='text-xs text-blue-800 font-bold'>10</span></span>
     </div>
    </>
  )

}


function Dropdown({buttonText, options}){
  const [isOpen, setIsOpen] = useState(false)
  return(
    <div className='items-center my-5'>
     <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`pl-3 pr-3 w-[180px] text-white font-bold items-center justify-between flex ${!isOpen ? 'bg-blue-500 border-blue-900 rounded-full' : 'bg-blue-500 rounded-tl-lg rounded-tr-lg'}`}
      >
        {buttonText}
        {isOpen ? <AiOutlineCaretUp className='h-8'/> : <AiOutlineCaretDown className='h-8'/>}
      </button>

    {isOpen && (
      <div className=' bg-blue-500 w-[180px] items-center flex-col justify-around absolute mt-0.25 rounded-br-lg rounded-bl-lg mb-15'>
          <h4  className='pb-2 flex justify-center text-white text-sm'>{options.option1}</h4>
          <h4  className='pb-2 flex justify-center text-white text-sm'>{options.option2}</h4>
          <h4  className='pb-2 flex justify-center text-white text-sm'>{options.option3}</h4>
      </div>
    )}
    </div>
  )
}