const { GraphQLServer } = require('graphql-yoga')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        link: (_, args) => links.find((link) => link.id === args.id),
        feed: () => links // <- thats the root
    },
    Mutation: {
        createLink: (root, args) => {
            const link = {
                id: `link-${idCount++}`,
                url: args.url,
                description: args.description
            }
            links.push(link)
            return link
        },
        updateLink: (root, args) => {
            links.forEach((link) => {
                if (link.id === args.id) {
                    link.url = args.url
                    link.description = args.description
                    return link
                }
            })
        },
        deleteLink: (root, args) => {
            let targetIndex
            links.forEach((link, i) => {
                if (link.id === args.id) {
                    targetIndex = i
                }
            })
            links.splice(targetIndex, 1)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers
})

server.start(() => console.log('Server is running on localhost:4000'))