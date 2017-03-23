import Users from 'meteor/nova:users';
import { GraphQLSchema } from 'meteor/nova:core';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* ... on User {
 *   trophies {
 *     trophy { ... }
 *     earnedAt
 *   }
 * }
 */
 
 const userTrophyType = `
   type UserTrophy {
     trophy: Trophy
     earnedAt: Date
   }
 `;

 GraphQLSchema.addSchema(userTrophyType);

const userTrophiesSchema = new SimpleSchema({
  trophyId: {
    type: String,
    resolveAs: 'trophy: Trophy',
  },
  earnedAt: {
    type: Date,
  },
});

Users.addField([
  // list of trophies earned by a user
  {
    fieldName: 'trophies',
    fieldSchema: {
      type: [userTrophiesSchema],
      optional: true,
      viewableBy: ['guests'],
      resolveAs: 'trophies: [UserTrophy]',
      defaultValue: [],
    },
  },
]);
