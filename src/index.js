const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (_, args, context, info) => {

            /*
            info object carried information about the GraphQL query.
           info = `
                {
                    id
                    description
                    url
                }
                `
            */

            return context.db.query.links({}, info)

            /*
            ^ Prisma changes Prisma database schema to JS functions.
            The above function is equivalent to:
            
            query {
               links(1st arg) {
                     id
                     description        <- (2nd arg)
                     url
               }
            }
            */

        } // <- thats the root
    },
    Mutation: {
        createLink: (_, args, context, info) => {
            return context.db.mutation.createLink({
                data: {
                    description: args.description,
                    url: args.url
                },
            }, info)

            /*
            Above function is equivalent to:

            mutation {
              createLink(data: {
                description: args.description
                url: args.url
              }) {
                info
              }
            }
            */
        },
        updateLink: (_, args, context, info) => {
            context.db.mutation.updateLink({
              data: {
                description: args.description,
                url: args.url
              },
              where: {
                id: args.id
              }
            }, info)
        },
        deleteLink: (_, args, context, info) => {
            context.db.mutation.deleteLink({
              where: {
                id: args.id
              }
            }, info)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
      ...req,
      db: new Prisma({
        typeDefs: 'src/generated/prisma.graphql',
        endpoint: 'https://us1.prisma.sh/yuya-oiwa/database/dev',
        secret: 'mysecret123',
        debug: true
      })
    })
})

server.start(() => console.log('Server is running on localhost:4000'))