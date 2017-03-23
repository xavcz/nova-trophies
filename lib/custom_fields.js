import Users from 'meteor/vulcan:users';
import { GraphQLSchema } from 'meteor/vulcan:core';
//import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import SimpleSchema from 'simpl-schema';
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
      type: Array,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: 'trophies: [UserTrophy]',
      defaultValue: [],
    },
  },
  {
    fieldName: 'trophies.$',
    fieldSchema: {
      type: userTrophiesSchema,
      optional: true,
    }
  },
]);
