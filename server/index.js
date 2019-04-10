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
    works: [Work]
  }
  type Work {
      id: ID!
      title: String!
      about: String!
      url: String!
  }
  type Mutation{
      createWork(title: String! about: String! url:String!): Work
      updateWork(id: ID! title: String! about: String! url:String!): Boolean
      removeWork(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    works: () => Work.find()
  },
  Mutation: {
      createWork: async (_, {title, about, url}) =>{
          const work = new Work({ title, about, url});
          await work.save();
          return work;
      },
      updateWork: async (_, {id, title, about, url}) =>{
          await Work.findByIdAndUpdate(id, { title, about, url});
          return true;
      },
      removeWork: async (_, {id}) =>{
        await Work.findByIdAndRemove(id);
        return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"));
});
