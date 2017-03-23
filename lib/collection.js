import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection } from 'meteor/nova:core';

/**
 * @summary The global namespace for Trophies.
 * @namespace Trophies
 */
const Trophies = createCollection({

  collectionName: 'trophies',

  typeName: 'Trophy',

  schema,

  resolvers,

  mutations,

});

export { Trophies };
