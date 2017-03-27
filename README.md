# nova-trophies

Example of implementation:

```js
// server/trophies.js in your custom package
import { Trophies, addTrophy } from 'meteor/xavcz:vulcan-trophies';

/* seed:
 * ...trophySchema
 * ...callbackStructure
 */

const trophiesSeeds = [
  {
    // schema
    title: 'Welcome',
    slug: 'welcome',
    value: 10,
    description: 'Welcome!',
    // callback
    operation: 'users.new',
    condition: () => true,
  },
  {
    // schema
    title: 'First post',
    slug: 'first-post',
    value: 1,
    description: 'First time you\'ve posted!',
    // callback
    operation: 'posts.new',
    // note: the count is not yet updated at this point
    condition: (post, currentUser) => currentUser.postCount === 0,
  },
  {
    // schema
    title: 'Top poster',
    slug: 'top-poster',
    value: 10,
    description: '10 posts!',
    // callback
    operation: 'posts.new',
    // note: the count is not yet updated at this point
    condition: (post, currentUser) => currentUser.postCount === 9,
  },
  {
    // schema
    title: 'Moderator',
    slug: 'mod',
    value: 20,
    description: 'You are a moderator!',
    // callback
    operation: 'users.edit',
    // note: the count is not yet updated at this point
    condition: (user, currentUser) => user.groups.includes('mods'),
  },
];


trophiesSeeds.forEach(({ operation, condition, slug, ...restOfSchema }) => {
  
  // insert/update your trophies
  Trophies.upsert({ slug }, { slug, active: true, ...restOfSchema }, {bypassCollection2: true });

  // add the callback (addCallback)
  addTrophy({
    operation,
    slug,
    condition,
  })
}
);
```
