import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLResolveInfo,
} from 'graphql/index.js'
import { UUIDType } from './types/uuid.js'
import { UserObjectType } from './types/user.js'
import { PostObjectType } from './types/post.js'
import { ProfileObjectType } from './types/profile.js'
import { MemberObjectType, MemberTypeId } from './types/member.js'
import { Author, Subscription } from './types/interfacesQuery.js'
import { Args } from './types/interfaceLoader.js'
import { ContextInterface } from './databaseApp.js'
import {
    ResolveTree,
    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info'

export const Query = new GraphQLObjectType({
    name: 'Query',

    fields: () => ({
        user: {
            type: UserObjectType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: Args, { prisma }: ContextInterface) => {
                return await prisma.user.findUnique({
                    where: { id },
                })
            },
        },

        users: {
            type: new GraphQLList(UserObjectType),
            resolve: async (
                _,
                _args,
                {
                    prisma,
                    loaders: { userSubscribedToLoader, subscribedToUser },
                }: ContextInterface,
                info: GraphQLResolveInfo,
            ) => {
                const { fields } = simplifyParsedResolveInfoFragmentWithType(
                    parseResolveInfo(info) as ResolveTree,
                    info.returnType,
                )

                const subscribedToUsers = 'subscribedToUser' in fields
                const usersSubscribedTo = 'userSubscribedTo' in fields

                const users = await prisma.user.findMany({
                    include: {
                        subscribedToUser: subscribedToUsers,
                        userSubscribedTo: usersSubscribedTo,
                    },
                })

                if (subscribedToUsers || usersSubscribedTo) {
                    const userMap = new Map<string, Subscription | Author>(
                        users.map((user) => [user.id, user]),
                    )

                    users.forEach((user) => {
                        if (subscribedToUsers) {
                            subscribedToUser.prime(
                                user.id,
                                user.subscribedToUser.map(
                                    ({ subscriberId }) => userMap.get(subscriberId) as Subscription,
                                ),
                            )
                        }

                        if (usersSubscribedTo) {
                            userSubscribedToLoader.prime(
                                user.id,
                                user.userSubscribedTo.map(
                                    ({ authorId }) => userMap.get(authorId) as Author,
                                ),
                            )
                        }
                    })
                }

                return users
            },
        },

        post: {
            type: PostObjectType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: Args, { prisma }: ContextInterface) =>
                await prisma.post.findUnique({
                    where: { id },
                }),
        },

        posts: {
            type: new GraphQLList(PostObjectType),
            resolve: (_parent, _args, { prisma }: ContextInterface) => prisma.post.findMany(),
        },

        profile: {
            type: ProfileObjectType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_, { id }: Args, { prisma }: ContextInterface) =>
                await prisma.profile.findUnique({
                    where: { id },
                }),
        },

        profiles: {
            type: new GraphQLList(ProfileObjectType),
            resolve: (_parent, _args, { prisma }: ContextInterface) =>
                prisma.profile.findMany(),
        },

        memberType: {
            type: MemberObjectType,
            args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
            resolve: async (_, { id }: Args, { prisma }: ContextInterface) =>
                await prisma.memberType.findUnique({
                    where: { id },
                }),
        },

        memberTypes: {
            type: new GraphQLList(MemberObjectType),
            resolve: (_, _args, { prisma }: ContextInterface) => prisma.memberType.findMany(),
        },
    }),
})
