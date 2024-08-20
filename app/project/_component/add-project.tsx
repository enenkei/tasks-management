'use client';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addProjectSchema } from '@/app/data/form-schema/add-project';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { createRecord } from '@/app/actions/crud';
import { toast } from '@/components/ui/use-toast';

type Props = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    userId: string,
    userName : string,
    refetchProjects : () => void
}

const AddProject = ({ open, onOpenChange, userId, userName, refetchProjects }: Props) => {
    // if (!userId) return;

    const [isPending, setIsPending] = useState<boolean>(false);
    const form = useForm<z.infer<typeof addProjectSchema>>({
        resolver: zodResolver(addProjectSchema),
        defaultValues: {
            name: ''
        }
    });

    const onSubmit = async(values : z.infer<typeof addProjectSchema>) => {
        // console.log(values);
        setIsPending(true);
        try{
            const data = {
                name : values.name,
                createdById : userId,
                createdBy  : userName
            }
            const project = await createRecord('Project', data);
            if(project){
                refetchProjects();
                onOpenChange(!open);
                toast({
                    title : '🥳Success!',
                    description : 'Project created'
                });
            }
        }catch(err){
            console.error(err);
        }finally{
            setIsPending(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='w-[350px] p-4'>
                <DialogHeader>
                    <DialogTitle>New project</DialogTitle>
                </DialogHeader>
                    <Form {...form}>
                        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center justify-start gap-3'>
                                <Button type='submit' disabled={isPending}
                                    variant={'secondary'}>Submit{isPending && <Loader2Icon className='w-4 h-4 ml-2' />}</Button>
                                <Button variant={'ghost'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onOpenChange(!open);
                                    }}
                                    >Cancel</Button>
                            </div>
                        </form>
                    </Form>
            </DialogContent>
        </Dialog>

    )
}

export default AddProject;
