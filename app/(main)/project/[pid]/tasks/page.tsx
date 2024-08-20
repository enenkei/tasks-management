'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaList } from 'react-icons/fa';
import { MdAdd, MdGridView } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { readRecords } from '@/app/actions/crud';
import { useAuth } from '@clerk/nextjs';
import { getTasksByProject } from '@/app/actions/task';
import Title from './_component/title';
import GridView from './_component/grid-view';
import ListView from './_component/list-view';
import AddTask from './_component/add-task';
import { useIsMounted } from 'usehooks-ts';

const TasksPage = () => {
    const { userId } = useAuth();
    const params = useParams();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any>();
    const [project, setProject] = useState<any>();
    const isMounted = useIsMounted();

    useEffect(() => {
        if (!isMounted()) setLoading(true);
        else setLoading(false);
    }, [isMounted]);
    // const searchParams = useSearchParams();
    const getUsers = async () => {
        const users = await readRecords('User', { isActive: true });
        setUsers(users);
        // console.log(users);
    }
    const getTasks = async () => {
        const proj = await getTasksByProject(userId!, params?.pid as string);
        setProject(proj);
        // console.log(proj.tasks);
    }

    useEffect(() => {
        getUsers();
        getTasks();
    }, [userId]);

    // console.log(searchParams.get("tab"));    

    return (

        <div className='w-full p-4'>
            <div className='flex items-center justify-between mb-4'>
                <Title title='Tasks' />
                <Button onClick={() => setOpen(true)}
                    className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'>
                    Create Task<MdAdd />
                </Button>
            </div>
            <div>
                <Tabs defaultValue="grid" className="w-full">
                    <TabsList>
                        <TabsTrigger value="grid">Grid view<MdGridView className='h-4 w-4 ml-2' /></TabsTrigger>
                        <TabsTrigger value="list">List view<FaList className='h-4 w-4 ml-2' /></TabsTrigger>
                    </TabsList>
                    <TabsContent value="grid">
                        {project?.tasks?.length > 0 ? (<GridView tasks={project?.tasks} setProject={setProject} />) : (
                            <div className='font-medium text-blue-600 text-sm text-center mt-12 bg-slate-100 p-2 rounded-md'>No tasks</div>
                        )}
                    </TabsContent>
                    <TabsContent value="list">
                        {project?.tasks?.length > 0 ? (<ListView tasks={project?.tasks} setProject={setProject} />) : (
                            <div className='text-blue-600 font-medium text-sm text-center mt-12 bg-slate-100 p-2 rounded-md'>No tasks</div>
                        )}
                    </TabsContent>
                </Tabs>
                <AddTask open={open} onOpenChange={setOpen} users={users} setProject={setProject} projectId={params?.pid as string} />
            </div>
        </div>
    )
}

export default TasksPage;