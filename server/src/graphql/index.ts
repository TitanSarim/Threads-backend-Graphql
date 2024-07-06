import { ApolloServer } from "@apollo/server";
import { primsaClient } from "../lib/db";
import {User} from './user'

async function createApolloGraphqlServer(){

    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
               ${User.queries}
            }
            type Mutation{
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
               ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        }
    })


    // start gql server
    await gqlServer.start();

    return gqlServer

}

export default createApolloGraphqlServer