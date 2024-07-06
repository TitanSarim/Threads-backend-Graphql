import express from "express"
import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4"

async function init(){

    const app = express();

    const port  = 8000;

    app.use(express.json())

    // create gql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
                hello: String
                say(name: String): String
            }
        `,
        resolvers: {
            Query: {
                hello: () => `Hey there, i am gql server`,
                say: (_, {name}: {name: String}) => `Hey ${name}, how are you?`
            }
        }
    })


    // start gql server
    await gqlServer.start();

    app.get('/', (req, res) => {

        res.json({message: "Server is up and running"});

    })

    app.use('/graphql', expressMiddleware(gqlServer))


    app.listen(port, () => console.log("Server is up and running at port 8000"));

}

init()