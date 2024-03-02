import {
    GraphQLInputObjectType,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
} from 'graphql'
import { UUIDType } from './uuid.js'
import { MemberObjectType, MemberTypeId } from './member.js'
import { Profile } from './interfacesQuery.js'
import { ContextInterface } from '../databaseApp.js'

export const ProfileObjectType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: UUIDType },
        memberTypeId: { type: MemberTypeId },
        memberType: {
            type: MemberObjectType,
            resolve: async (
                parent: Profile,
                _,
                { loaders: { memeberTypeLoader } }: ContextInterface,
            ) => memeberTypeLoader.load(parent.memberTypeId),
        },
    }),
})

export const CreateProfileInputObjectType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: () => ({
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    }),
})

export const ChangeProfileInputObjectType = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: () => ({
        memberTypeId: { type: MemberTypeId },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
    }),
})
