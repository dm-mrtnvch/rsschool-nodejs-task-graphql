import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js'
import { GraphQLSchema, graphql, parse, validate } from 'graphql'
import depthLimit from 'graphql-depth-limit'
import { Mutations } from './mutations.js'
import { Query } from './queries.js'
import { createLoaders } from './loader.js'

export const schemaApp = new GraphQLSchema({
  query: Query,
  mutation: Mutations,
})

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body
      const err = validate(schemaApp, parse(query), [depthLimit(5)])

      if (err?.length > 0) {
        return { data: '', errors: err }
      }

      const { data, errors } = await graphql({
        schema: schemaApp,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          loaders: createLoaders(prisma),
        },
      })

      return { data, errors }
    },
  })
}

export default plugin
