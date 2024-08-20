import React from 'react';
import TaskCard from './task-card';
import { Task } from '@prisma/client';
import TaskTitle from './task-title';

type Props = {
  tasks: any,
  setProject : (proj : any) => void
}

const TASK_TYPE: any = {
  todo: "bg-indigo-600",
  inprogress: "bg-amber-600",
  inreview: "bg-cyan-600",
  completed: "bg-green-600",
};

const GridView = ({ tasks, setProject }: Props) => {
  const todos = tasks?.filter((task: Task) => task.stage === 'todo');
  const inprogress = tasks?.filter((task: Task) => task.stage === 'inprogress');
  const inreview = tasks?.filter((task: Task) => task.stage === 'review');
  const done = tasks?.filter((task: Task) => task.stage === 'completed');

  return (
    <>
      <div className='min-w-[800px]'>
        <div className='flex w-full justify-between gap-4 md:gap-x-12 py-2 mt-2 shadow rounded-md'>
          <TaskTitle label={'To-do'} className={TASK_TYPE.todo} />
          <TaskTitle label={'In-progress'} className={TASK_TYPE.inprogress} />
          <TaskTitle label={'Review'} className={TASK_TYPE.inreview} />
          <TaskTitle label={'Completed'} className={TASK_TYPE.completed} />
        </div>
        <div className='w-full py-4 grid grid-cols-4 gap-4 2xl:gap-10'>
          <div className='grid grid-cols-1 gap-2 place-content-start'>
            {todos?.map((task: any, idx: number) => (
              <TaskCard task={task} key={idx} setProject={setProject}/>
            ))}
          </div>
          <div className='grid grid-cols-1 gap-2 place-content-start'>
            {inprogress?.map((task: any, idx: number) => (
              <TaskCard task={task} key={idx} setProject={setProject} />
            ))}
          </div>
          <div className='grid grid-cols-1 gap-2 place-content-start'>
            {inreview?.map((task: any, idx: number) => (
              <TaskCard task={task} key={idx} setProject={setProject}/>
            ))}
          </div>
          <div className='grid grid-cols-1 gap-2 place-content-start'>
            {done?.map((task: any, idx: number) => (
              <TaskCard task={task} key={idx} setProject={setProject}/>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default GridView;
