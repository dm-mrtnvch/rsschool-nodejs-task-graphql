import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql'
import { MemberEnumType } from './interfacesQuery.js'

export const MemberTypeId = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        [MemberEnumType.BASIC]: { value: MemberEnumType.BASIC },
        [MemberEnumType.BUSINESS]: { value: MemberEnumType.BUSINESS },
    },
})

export const MemberObjectType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: { type: MemberTypeId },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
    }),
})
