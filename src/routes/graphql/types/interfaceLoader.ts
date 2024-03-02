import { Post, Profile, User } from '@prisma/client'
import DataLoader from 'dataloader'
import { Author, Member, Subscription } from './interfacesQuery.js'

export type Args = {
    id: string
}

export type Loaders = {
    userLoader: DataLoader<string, User>
    userSubscribedToLoader: DataLoader<string, Author[]>
    subscribedToUser: DataLoader<string, Subscription[]>
    postsLoader: DataLoader<string, Post[]>
    profileLoader: DataLoader<string, Profile>
    memeberTypeLoader: DataLoader<string, Member>
}
