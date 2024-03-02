import {
    GraphQLFloat,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
} from 'graphql'
import { UUIDType } from './uuid.js'
import { User } from './interfacesQuery.js'
import { GraphQLInputObjectType } from 'graphql/index.js'
import { ContextInterface } from '../databaseApp.js'
import { ProfileObjectType } from './profile.js'
import { PostObjectType } from './post.js'

export const UserObjectType: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },

        posts: {
            type: new GraphQLList(PostObjectType),
            resolve: async ({ id }: User, _, { loaders }: ContextInterface) =>
                loaders.postsLoader.load(id),
        },

        profile: {
            type: ProfileObjectType,
            resolve: async ({ id }: User, _, { loaders }: ContextInterface) =>
                loaders.profileLoader.load(id),
        },

        userSubscribedTo: {
            type: new GraphQLList(UserObjectType),
            resolve: async ({ id }: User, _, { loaders }: ContextInterface) =>
                loaders.userSubscribedToLoader.load(id),
        },

        subscribedToUser: {
            type: new GraphQLList(UserObjectType),
            resolve: async ({ id }: User, _, { loaders }: ContextInterface) =>
                loaders.subscribedToUser.load(id),
        },
    }),
})

export const CreateUserInputType = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
    }),
})

export const ChangeUserInputType = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    }),
})
