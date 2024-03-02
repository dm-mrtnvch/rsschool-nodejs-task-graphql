import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLNonNull,
} from 'graphql'
import { UUIDType } from './uuid.js'

export const PostObjectType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType },
    }),
})

export const CreatePostInputObjectType = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: () => ({
        authorId: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

export const ChangePostInputObjectType = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: () => ({
        id: { type: UUIDType },
        authorId: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    }),
})
