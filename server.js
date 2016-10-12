const fs = require('fs');

const {
  graphql,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql');

const mongoose = require('mongoose');
const prebuilt = require('mongodb-prebuilt');

if (!fs.existsSync('/data/db')) {
  console.log('You need to create the mongodb data directory:');
  console.log('  sudo mkdir -m 777 /data/db');
  process.exit(1);
}

// Set up the database.
// In a real production environment you wouldn't want your application
// server to start your database process like this.
prebuilt.start_server(null, (errorCode) => {
  console.log('start_server failed with error code', errorCode);
});

mongoose.connect('mongodb://localhost:27017/dev');

const config = {
  text: String,
  completed: Boolean,
};

const schema = new mongoose.Schema(config);

const Todo = mongoose.model('Todo', schema);

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: { type: GraphQLString },
    text: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  },
});

const createTodo = {
  type: TodoType,
  args: {
    text: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  },
  resolve: (_, args) => {
    let todo = new Todo(args);
    return todo.save();
  },
};

const getTodo = {
  type: TodoType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: (_, {id}) => {
    return Todo.findOne({id});
  },
};

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getTodo,
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTodo,
  },
})

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

// TODO: refactor to expose the schema in a module, test it
