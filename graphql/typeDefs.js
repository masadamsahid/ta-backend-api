import {gql} from "apollo-server";

const typeDefs = gql`
    type Query{
        sayHi: String!
    }
`

export default typeDefs