import { PrismaClient } from '@prisma/client'
import { Loaders } from './types/interfaceLoader.js'

export type ContextInterface = {
    prisma: PrismaClient
    loaders: Loaders
}
