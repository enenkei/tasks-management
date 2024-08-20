'use client';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { BellIcon } from 'lucide-react';
import React from 'react'
import { BiSolidDashboard } from 'react-icons/bi';
import ProjectCard from './_component/project-card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {v4 as uuid4} from 'uuid';
import { Project } from '@prisma/client';

const ProjectPage = () => {
    const { user } = useUser();
    const {data : projects, refetch : refetchProjects} = useQuery({
        queryKey: ['get-all-project', user?.id],
        queryFn : async() => {
            const {data} = await axios.get('/api/project/get/all');
            return data.projects;
        }
    });
    const uuid = uuid4();
    return (
        <div className='flex flex-col w-full h-full items-center p-10 mt-24'>
            <div className='flex flex-col w-[800px] shadow-sm p-4 rounded-md'>
                <div className='flex items-center place-content-between'>
                    <div className='flex gap-3 items-center justify-center'>
                        <BiSolidDashboard className='h-8 w-8' fill='#ce464c' />
                        <p className='text-purple-700 font-semibold text-justify underline underline-offset-2'>
                            Projects dashboard
                        </p>
                    </div>
                    <div className='flex gap-3 items-center justify-center'>
                        <BellIcon className='h-6 w-6' />
                        <SignedIn><UserButton /></SignedIn>
                    </div>
                </div>
            </div>
            <div className='[800px] mt-10 p-10 grid gap-14 md:grid-cols-3 
                shadow-md rounded-md items-center justify-between content-evenly'>
                <ProjectCard isEmpty={true} user={user} refetchProjects={refetchProjects}/>
                {projects?.map((proj : Project, idx : number) => (
                    <ProjectCard isEmpty={false} user={user} project={proj} key={idx+uuid} refetchProjects={refetchProjects} />
                ))}
            </div>
        </div>
    )
}

export default ProjectPage;