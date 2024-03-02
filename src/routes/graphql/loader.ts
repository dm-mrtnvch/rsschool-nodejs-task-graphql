import { Post, PrismaClient, Profile, User } from '@prisma/client'
import DataLoader from 'dataloader'
import { Author, Member, Subscription } from './types/interfacesQuery.js'

export const createLoaders = (prisma: PrismaClient) => ({
    postsLoader: createPostsLoader(prisma),
    profileLoader: createProfileLoader(prisma),
    userLoader: createUserLoader(prisma),
    userSubscribedToLoader: createUserToSubscribeLoader(prisma),
    subscribedToUser: createSubscribedToUserLoader(prisma),
    memeberTypeLoader: createMemberLoader(prisma),
})

const createMemberLoader = (prisma: PrismaClient) =>
    new DataLoader<unknown, Member | null>(async (userIds) => {
        const ids = userIds as string[]
        const members: Member[] = await prisma.memberType.findMany({
            where: { id: { in: ids } },
        })

        const membersMap = new Map(members.map((member) => [member.id, member]))
        return ids.map((id) => membersMap.get(id) ?? null)
    })

const createPostsLoader = (prisma: PrismaClient) =>
    new DataLoader<unknown, Post[]>(async (userIds) => {
        const ids = userIds as string[]
        const posts: Post[] = await prisma.post.findMany({
            where: { authorId: { in: ids } },
        })

        const postsMap = new Map<string, Post[]>()
        posts.forEach((post) => {
            const postsAuthor = postsMap.get(post.authorId) || []
            postsAuthor.push(post)
            postsMap.set(post.authorId, postsAuthor)
        })

        return ids.map((id) => postsMap.get(id) || [])
    })

const createProfileLoader = (prisma: PrismaClient) =>
    new DataLoader<unknown, Profile | null>(async (userIds) => {
        const ids = userIds as string[]
        const profiles: Profile[] = await prisma.profile.findMany({
            where: { userId: { in: ids } },
        })

        const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]))
        return ids.map((id) => profileMap.get(id) || null)
    })

const createUserLoader = (prisma: PrismaClient) =>
    new DataLoader<string, User | null>(async (userIds) => {
        const ids = userIds as string[]
        const users: User[] = await prisma.user.findMany({
            where: { id: { in: ids } },
        })

        const userMap = new Map(users.map((user) => [user.id, user]))
        return ids.map((id) => userMap.get(id) || null)
    })

const createSubscribedToUserLoader = (prisma: PrismaClient) =>
    new DataLoader<string, Author[]>(async (userIds) => {
        const ids = userIds as string[]
        const authors: Author[] = await prisma.user.findMany({
            where: { userSubscribedTo: { some: { authorId: { in: ids } } } },
            include: { userSubscribedTo: true },
        })

        const authorsById = authors.reduce((map, author) => {
            author.userSubscribedTo.forEach((subscription) => {
                const authorsList = map.get(subscription.authorId) || []
                authorsList.push(author)
                map.set(subscription.authorId, authorsList)
            })
            return map
        }, new Map<string, Author[]>())

        return ids.map((id) => authorsById.get(id) || [])
    })

const createUserToSubscribeLoader = (prisma: PrismaClient) =>
    new DataLoader<string, Subscription[]>(async (userIds) => {
        const ids = userIds as string[]
        const subscriptions: Subscription[] = await prisma.user.findMany({
            where: {
                subscribedToUser: { some: { subscriberId: { in: ids } } },
            },
            include: { subscribedToUser: true },
        })

        const subscriptionsBySubscriberId = subscriptions.reduce((map, user) => {
            user.subscribedToUser.forEach((subscription) => {
                const existingSubscriptions = map.get(subscription.subscriberId) || []
                existingSubscriptions.push(user)
                map.set(subscription.subscriberId, existingSubscriptions)
            })
            return map
        }, new Map<string, Subscription[]>())

        return ids.map((id) => subscriptionsBySubscriberId.get(id) || [])
    })
