const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    // ctx.db is how we ACCESS the db
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info); // the actual query live in 'info'. to pass from frontend to backend
    
    return item;
  }
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   // create a dog!
  //   const newDog = { name: args.name };
  //   global.dogs.push(newDog);
  //   return newDog;
  // },
};

module.exports = Mutations;
