import express from "express"
import {expressMiddleware} from "@apollo/server/express4"
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";

async function init(){

    const app = express();

    const port  = 8000;

    app.use(express.json())


    app.get('/', (req, res) => {

        res.json({message: "Server is up and running"});

    })

    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer(), {
        context: async ({req}) => {
            const token = req.headers['token']
            try {
                const user = UserService.decodeJwtToken(token as string);
                return {user};
            } catch (error) {
                return {}
            }
        }
    }))


    app.listen(port, () => console.log("Server is up and running at port 8000"));

}

init()