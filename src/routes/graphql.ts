import { FastifyPluginAsync } from 'fastify';
import helmet from '@fastify/helmet';
import mercuriusCodegen, { gql } from 'mercurius-codegen';
import mercurius, { IResolvers } from 'mercurius';

const graphql: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const schema = gql`
    type Query {
      hello(name: String!): String!
    }
  `;

  const resolvers: IResolvers = {
    Query: {
      hello(root: any, { name }: any, ctx: any, info: any) {
        // root ~ {}
        // name ~ string
        // ctx.authorization ~ string | undefined
        // info ~ GraphQLResolveInfo
        return 'hello ' + name;
      },
    },
  };

  fastify.register(helmet, {
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false,
  });

  fastify.register(mercurius, {
    schema,
    resolvers,
  });

  mercuriusCodegen(fastify, {
    // Commonly relative to your root package.json
    targetPath: './src/graphql/generated.ts',
  }).catch(console.error);
};

export default graphql;
