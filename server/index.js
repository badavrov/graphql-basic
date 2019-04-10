const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/portfolio");

const Work = mongoose.model('Work', {
    title: String,
    about: String,
    url: String
})

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
  type Work {
      id: ID!
      title: String!
      about: String!
      url: String!
  }
  type Mutation{
      createWork(title: String! about: String! url:String!): Work
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`
  },
  Mutation: {
      createWork: async (_, {title, about, url}) =>{
          const work = new Work({ title, about, url});
          await work.save();
          return work;
      }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});
