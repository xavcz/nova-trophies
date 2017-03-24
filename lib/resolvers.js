import { GraphQLSchema } from 'meteor/vulcan:core';

const specificResolvers = {
  User: {
    trophies(user, args, context) {
      return user.trophies
        .map(({ trophyId, earnedAt }) => ({
          trophy: context.Trophies.findOne(
            { _id: trophyId },
            { fields: context.getViewableFields(context.currentUser, context.Trophies) },
          ),
          earnedAt,
        }))
        // sort by desc order on value
        .sort((prev, curr) => curr.trophy.value - prev.trophy.value)
        // send to the client only the active ones
        .filter(({ trophy }) => trophy.active);
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);

const resolvers = {

  list: {

    name: 'trophiesList',

    resolver(root, {terms}, context) {
      let {selector, options} = context.Trophies.getParameters(terms);
      options.limit = (terms.limit < 1 || terms.limit > 100) ? 100 : terms.limit;
      options.skip = terms.offset;
      options.fields = context.getViewableFields(context.currentUser, context.Trophies);
      return context.Trophies.find(selector, options).fetch();
    },

  },

  single: {

    name: 'trophiesSingle',

    resolver(root, {documentId, slug}, context) {
      const selector = documentId ? {_id: documentId} : {slug: slug};
      const post = context.Trophies.findOne(selector);
      return context.Users.keepViewableFields(context.currentUser, context.Trophies, post);
    },

  },

  total: {

    name: 'trophiesTotal',

    resolver(root, {terms}, context) {
      const {selector} = context.Trophies.getParameters(terms);
      return context.Trophies.find(selector).count();
    },

  }
};

export default resolvers;
