import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
    imgSrc: string,
    fallbackText: string
}

const UserAvatar = ({ imgSrc, fallbackText }: Props) => {
    return (
        <Avatar>
            <AvatarImage src={imgSrc!} />
            <AvatarFallback><span className='text-center'>{fallbackText}</span></AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar;
