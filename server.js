import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} from "graphql";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})
.promise();


  async function createDatabaseAndTables() {
    try {
       const connection = pool;

       await connection.query(`USE ${process.env.MYSQL_DATABASE}`);
   
       const [tables] = await connection.query(`SHOW TABLES LIKE 'food'`);
       if (tables.length === 0) {
         await connection.query(`
           CREATE TABLE food (
             id INT AUTO_INCREMENT PRIMARY KEY,
             food_name VARCHAR(255) NOT NULL,
             chefId INT NOT NULL,
             restaurantId INT NOT NULL
           )
         `);
         console.log('Table food created.');
       } else {
         console.log('Table food already exists.');
       }
   
       const [chefsTables] = await connection.query(`SHOW TABLES LIKE 'chefs'`);
       if (chefsTables.length === 0) {

         await connection.query(`
           CREATE TABLE chefs (
             id INT AUTO_INCREMENT PRIMARY KEY,
             chef_name VARCHAR(255) NOT NULL,
             pay FLOAT NOT NULL,
             restaurantId INT NOT NULL
           )
         `);
         console.log('Table chefs created.');
       } else {
         console.log('Table chefs already exists.');
       }

       const [restaurantsTables] = await connection.query(`SHOW TABLES LIKE 'restaurants'`);
       if (restaurantsTables.length === 0) {
         await connection.query(`
           CREATE TABLE restaurants (
             id INT AUTO_INCREMENT PRIMARY KEY,
             restaurant_name VARCHAR(255) NOT NULL,
             rating FLOAT NOT NULL
           )
         `);
         console.log('Table restaurants created.');
       } else {
         console.log('Table restaurants already exists.');
       }
    } catch (error) {
       console.error('Error creating database and tables:', error);
    }
   }
   
await createDatabaseAndTables();


async function getFood() {
  const [rows] = await pool.query("select * from food");
  return rows;
}

async function addFoodItem(food) {
  const [rows] = await pool.query(
    "INSERT INTO food (id, food_name, chefId, restaurantId) VALUES (?, ?, ?, ?)",
    [food.id, food.food_name, food.chefId, food.restaurantId]
  );
  return rows;
}

async function getChefs() {
  const [rows] = await pool.query("select * from chefs");
  return rows;
}

async function addChef(chef) {
  const [rows] = await pool.query(
    "INSERT INTO chefs (id, chef_name, pay, restaurantId) VALUES (?, ?, ?, ?)",
    [chef.id, chef.chef_name, chef.pay, chef.restaurantId]
  );
  return rows;
}

async function getRestaurants() {
  const [rows] = await pool.query("select * from restaurants");
  return rows;
}

async function addRestaurant(restaurant) {
  const [rows] = await pool.query(
    "INSERT INTO restaurants (id, restaurant_name, rating) VALUES (?, ?, ?)",
    [restaurant.id, restaurant.restaurant_name, restaurant.rating]
  );
  return rows;
}

let food = await getFood();

let chefs = await getChefs();
let restaurants = await getRestaurants();

const app = express();

const RestaurantType = new GraphQLObjectType({
  name: "restaurant",
  description: "This represents a restaurant.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    restaurant_name: { type: GraphQLNonNull(GraphQLString) },
    rating: { type: GraphQLNonNull(GraphQLFloat) },
    chefs: {
      type: new GraphQLList(ChefType),
      resolve: (restaurant) => {
        return chefs.filter((chef) => chef.restaurantId === restaurant.id);
      },
    },
    food: {
      type: new GraphQLList(FoodType),
      resolve: (restaurant) => {
        return food.filter((item) => item.restaurantId === restaurant.id);
      },
    },
  }),
});

const ChefType = new GraphQLObjectType({
  name: "chef",
  description: "This represents a chef that makes food in restaurants.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    chef_name: { type: GraphQLNonNull(GraphQLString) },
    pay: { type: GraphQLNonNull(GraphQLFloat) },
    chefId: { type: GraphQLNonNull(GraphQLInt) },
    food: {
      type: new GraphQLList(FoodType),
      resolve: (chef) => {
        return food.filter((item) => item.chefId === chef.id);
      },
    },
    restaurantId: { type: GraphQLNonNull(GraphQLInt) },
    restaurant: {
      type: RestaurantType,
      resolve: (chef) => {
        return restaurants.find(
          (restaurant) => restaurant.id === chef.restaurantId
        );
      },
    },
  }),
});

const FoodType = new GraphQLObjectType({
  name: "food",
  description: "This represents food made by a chef.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    food_name: { type: GraphQLNonNull(GraphQLString) },
    chefId: { type: GraphQLNonNull(GraphQLInt) },
    chef: {
      type: ChefType,
      resolve: (food) => {
        return chefs.find((chef) => chef.id === food.chefId);
      },
    },
    restaurantId: { type: GraphQLNonNull(GraphQLInt) },
    restaurant: {
      type: RestaurantType,
      resolve: (food) => {
        return restaurants.find(
          (restaurant) => restaurant.id === food.restaurantId
        );
      },
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "mutation",
  description: "Root Mutation",
  fields: () => ({
    addFood: {
      type: FoodType,
      description: "Add food",
      args: {
        food_name: { type: GraphQLNonNull(GraphQLString) },
        chefId: { type: GraphQLNonNull(GraphQLInt) },
        restaurantId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const foodItem = {
          id: food.length + 1,
          food_name: args.food_name,
          chefId: args.chefId,
          restaurantId: args.restaurantId,
        };
        (async () => {
          await addFoodItem(foodItem);
          food = await getFood();
        })();
        return foodItem;
      },
    },
    addChef: {
      type: ChefType,
      description: "Add chef",
      args: {
        chef_name: { type: GraphQLNonNull(GraphQLString) },
        pay: { type: GraphQLNonNull(GraphQLFloat) },
        restaurantId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const chef = {
          id: chefs.length + 1,
          chef_name: args.chef_name,
          pay: args.pay,
          restaurantId: args.restaurantId,
        };
        (async () => {
          await addChef(chef);
          chefs = await getChefs();
        })();
        return chef;
      },
    },
    addRestaurant: {
      type: RestaurantType,
      description: "Add restaurant",
      args: {
        restaurant_name: { type: GraphQLNonNull(GraphQLString) },
        rating: { type: GraphQLNonNull(GraphQLFloat) },
      },
      resolve: (parent, args) => {
        const restaurant = {
          id: restaurants.length + 1,
          restaurant_name: args.restaurant_name,
          rating: args.rating,
        };
        (async () => {
          await addRestaurant(restaurant);
          restaurants = await getRestaurants();
        })();
        return chef;
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "query",
  description: "Root Query",
  fields: () => ({
    allFood: {
      type: new GraphQLList(FoodType),
      description: "All Food in database",
      resolve: () => food,
    },
    food: {
      type: FoodType,
      description: "One Food",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return food.find((item) => item.id === args.id);
      },
    },
    allChefs: {
      type: new GraphQLList(ChefType),
      description: "All Chefs in database",
      resolve: () => chefs,
    },
    chef: {
      type: ChefType,
      description: "One Chef",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return chefs.find((item) => item.id === args.id);
      },
    },
    allRestaurants: {
      type: new GraphQLList(RestaurantType),
      description: "All Restaurants in database",
      resolve: () => restaurants,
    },
    restaurant: {
      type: RestaurantType,
      description: "One Restaurant",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return restaurants.find((item) => item.id === args.id);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.all("/graphql", createHandler({ schema }));

app.listen({ port: 8000 });
