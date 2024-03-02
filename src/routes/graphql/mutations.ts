import { GraphQLObjectType, GraphQLBoolean } from 'graphql'
import {
    PostObjectType,
    CreatePostInputObjectType,
    ChangePostInputObjectType,
} from './types/post.js'
import { UUIDType } from './types/uuid.js'
import {
    ProfileObjectType,
    CreateProfileInputObjectType,
    ChangeProfileInputObjectType,
} from './types/profile.js'
import {
    ChangeUserInputType,
    CreateUserInputType,
    UserObjectType,
} from './types/user.js'
import { Post, Profile, User } from './types/interfacesQuery.js'
import {
    ChangePost,
    CreatePost,
    ChangeProfile,
    CreateProfile,
    UserSubscribedTo,
    ChangeUser,
    CreateUser,
} from './types/interfacesMutations.js'
import { ContextInterface } from './databaseApp.js'

export const Mutations = new GraphQLObjectType({
    name: 'Mutation',

    fields: () => ({
        createUser: {
            type: UserObjectType,
            args: { dto: { type: CreateUserInputType } },
            resolve: async (_parent, { dto }: CreateUser, { prisma }: ContextInterface) => {
                return await prisma.user.create({ data: dto })
            },
        },

        changeUser: {
            type: UserObjectType,
            args: { id: { type: UUIDType }, dto: { type: ChangeUserInputType } },
            resolve: async (_parent, { id, dto }: ChangeUser, { prisma }: ContextInterface) => {
                return await prisma.user.update({ where: { id: id }, data: dto })
            },
        },

        deleteUser: {
            type: GraphQLBoolean,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: User, { prisma }: ContextInterface) => {
                await prisma.user.delete({ where: { id: id } })
                return null
            },
        },

        createPost: {
            type: PostObjectType,
            args: { dto: { type: CreatePostInputObjectType } },
            resolve: async (_parent, { dto }: CreatePost, { prisma }: ContextInterface) => {
                return await prisma.post.create({ data: dto })
            },
        },

        changePost: {
            type: PostObjectType,
            args: { id: { type: UUIDType }, dto: { type: ChangePostInputObjectType } },
            resolve: async (_parent, { id, dto }: ChangePost, { prisma }: ContextInterface) => {
                return await prisma.post.update({ where: { id }, data: dto })
            },
        },

        deletePost: {
            type: GraphQLBoolean,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: Post, { prisma }: ContextInterface) => {
                try {
                    await prisma.post.delete({ where: { id } })
                } catch {
                    return false
                }

                return true
            },
        },

        createProfile: {
            type: ProfileObjectType,
            args: { dto: { type: CreateProfileInputObjectType } },
            resolve: async (_parent, { dto }: CreateProfile, { prisma }: ContextInterface) => {
                return await prisma.profile.create({ data: dto })
            },
        },

        changeProfile: {
            type: ProfileObjectType,
            args: { id: { type: UUIDType }, dto: { type: ChangeProfileInputObjectType } },
            resolve: async (_, { id, dto }: ChangeProfile, { prisma }: ContextInterface) => {
                return await prisma.profile.update({ where: { id }, data: dto })
            },
        },

        deleteProfile: {
            type: GraphQLBoolean,
            args: { id: { type: UUIDType } },
            resolve: async (_, { id }: Profile, { prisma }: ContextInterface) => {
                try {
                    await prisma.profile.delete({ where: { id } })
                } catch (err) {
                    return false
                }
                return true
            },
        },

        subscribeTo: {
            type: UserObjectType,
            args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
            resolve: async (
                _,
                { userId, authorId }: UserSubscribedTo,
                { prisma }: ContextInterface,
            ) => {
                await prisma.subscribersOnAuthors.create({
                    data: { subscriberId: userId, authorId: authorId },
                })
                const user = await prisma.user.findFirst({ where: { id: userId } })
                return user
            },
        },

        unsubscribeFrom: {
            type: GraphQLBoolean,
            args: { userId: { type: UUIDType }, authorId: { type: UUIDType } },
            resolve: async (
                _,
                { userId, authorId }: UserSubscribedTo,
                { prisma }: ContextInterface,
            ) => {
                try {
                    await prisma.subscribersOnAuthors.deleteMany({
                        where: { subscriberId: userId, authorId: authorId },
                    })
                } catch {
                    return false
                }
                return true
            },
        },
    }),
})
