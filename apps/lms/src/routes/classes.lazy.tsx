import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/classes')({
  component: () => <Classes />
})

function Classes({}){

  const files = [

    //just a mockup ...actual thing is gonna be done after implementation from backend 

    {
      title: 'FILE 1',
      date: '3 Jun',
    },
    {
      title: 'FILE 2',
      date: '1 Jun',
    },
    {
      title: 'FILE 3',
      date: '21 May',
    },
    {
      title: 'FILE 4',
      date: '22 May'
    },
    {
      title: 'FILE 5',
      date: '23 May'
    },
    {
      title: 'FILE 6',
      date: '24 May'
    },
    {
      title: 'FILE 7',
      date: '25 May'
    },
    {
      title: 'FILE 8',
      date: '26 May'
    },
    {
      title: 'FILE 9',
      date: '27 May'
    },
    {
      title: 'FILE 10',
      date: '28 May'
    },
    {
      title: 'FILE 11',
      date: '29 May'
    },
    {
      title: 'FILE 12',
      date: '30 May'
    },
    {
      title: 'FILE 13',
      date: '31 May'
    },
    {
      title: 'FILE 14',
      date: '1 Jun'
    },
    {
      title: 'FILE 15',
      date: '2 Jun'
    },
    {
      title: 'FILE 16',
      date: '3 Jun'
    },
    {
      title: 'FILE 17',
      date: '4 Jun'
    },
    {
      title: 'FILE 18',
      date: '5 Jun'
    },
    {
      title: 'FILE 19',
      date: '6 Jun'
    },
    {
      title: 'FILE 20',
      date: '7 Jun'
    },
    {
      title: 'FILE 21',
      date: '8 Jun'
    },
    {
      title: 'FILE 22',
      date: '9 Jun'
    },
    {
      title: 'FILE 23',
      date: '10 Jun'
    },
    {
      title: 'FILE 24',
      date: '11 Jun'
    },
    {
      title: 'FILE 25',
      date: '12 Jun'
    },
    {
      title: 'FILE 26',
      date: '13 Jun'
    },
    {
      title: 'FILE 27',
      date: '14 Jun'
    },
    {
      title: 'FILE 28',
      date: '15 Jun'
    },
    {
      title: 'FILE 29',
      date: '16 Jun'
    },
    {
      title: 'FILE 30',
      date: '17 Jun'
    },
    {
      title: 'FILE 31',
      date: '18 Jun'
    },
    {
      title: 'FILE 32',
      date: '19 Jun'
    },
    {
      title: 'FILE 33',
      date: '20 Jun'
    }  
  ]

  return (
    <>
      <div className='text-blue-900'>
        <h2>Resources</h2>
      </div> 
      <div className='w-full min-h-[300px] bg-blue-50 p-1 rounded-sm shadow-sm mt-2'>
        <div className='bg-white w-full h-full rounded p-1 gap-2 flex flex-col '>
          {
            files.map(({ title, date}, idx) => {
              return (
                <div key={idx} className='w-full py-2 px-3 bg-blue-50 flex justify-between items-center gap-2 rounded-sm hover:bg-blue-600/10 text-blue-800'>
                  <h5 className='flex-1 truncate'>{title}</h5>
                  <div className='flex gap-4 items-center'>
                    <span className='text-sm'>{date}</span>
                  </div>
                </div>
              );
            })
          }
        </div>

      </div>
    </>
  )

}
