/* eslint-disable prettier/prettier */
const graphql = require('graphql');
const { getUser , getPic ,mutatePic} = require('../core');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

//OBJECT TYPES
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        bio: { type: GraphQLString },
        email: {type: GraphQLString},
    })
});
const PicType = new GraphQLObjectType({
    name: 'Pic',
    fields: () => ({
        id: { type: GraphQLID },
        uri: { type: GraphQLString },
    })
});


//QUERIES
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                const a = await getUser();
                console.log(getUser);
                return  {name:a[0].name, bio:a[0].bio, email:a[0].email};
                
            }
        },
        pic: {
            type: PicType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                const a = await getPic();
                console.log(getPic);
                return  {uri:a[0].uri};
            }
        },
    }
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        editPic: {
            type: PicType,
            args: {
                id: { type: GraphQLID },
                uri: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const b = await mutatePic(args.uri);
                const a = await getPic();
                console.log(getPic);
                return  {uri:a[0].uri};
            }
        },
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});