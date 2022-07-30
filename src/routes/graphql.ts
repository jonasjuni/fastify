import { FastifyPluginAsync } from 'fastify';
import mercuriusCodegen, { gql } from 'mercurius-codegen';
import mercurius, { IResolvers } from 'mercurius';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';

const graphql: FastifyPluginAsync = async (fastify): Promise<void> => {
  const schema = gql`
    type Query {
      hello(name: String!): String!
    }
  `;

  const resolvers: IResolvers = {
    Query: {
      hello(root, { name }) {
        // root ~ {}
        // name ~ string
        // ctx.authorization ~ string | undefined
        // info ~ GraphQLResolveInfo
        return 'Hello ' + name;
      },
    },
  };

  fastify.register(helmet, {
    contentSecurityPolicy:
      process.env.NODE_ENV === 'development' ? false : undefined,
  });

  fastify.register(cors, {
    origin: '*',
  });

  fastify.register(mercurius, {
    schema,
    resolvers,
  });

  mercuriusCodegen(fastify, {
    // Commonly relative to your root package.json
    targetPath: './src/graphql/generated.ts',
    watchOptions: {
      enabled: process.env.NODE_ENV === 'development',
    },
  }).catch(console.error);
};

export default graphql;
