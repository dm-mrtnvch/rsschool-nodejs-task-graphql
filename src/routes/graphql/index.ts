import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js'
import {graphql, GraphQLSchema, parse, validate} from 'graphql'
import depthLimit from "graphql-depth-limit"

export const schemaApp = new GraphQLSchema({
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
        contextValue: {},
      })

      return { data, errors }
    },
  })
}

export default plugin
