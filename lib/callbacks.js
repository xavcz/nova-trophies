import { addCallback } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import { Trophies } from './collection';

const addTrophy = ({
  operation,
  slug,
  condition: trophyCondition
}) => {
  if (typeof trophyCondition !== 'function') {
    // eslint-disable-next-line
    console.error(`
      Error on ${slug}, callback ${operation}.
      The trophy condition needs to be a function!!`);
    return;
  }

  // get the relevant trophy
  const trophy = Trophies.findOne({ slug });

  // exit if the trophy doesn't exist
  if(!trophy) {
    // eslint-disable-next-line
    console.warn(`${operation} tried to run for an undefined trophy: ${slug}`);

    return;
  }

  const callbackTorun = (...callbackArgs) => {
    // extract document, currentUser & collection from the callback arguments
    // => callbackArgs = [ document, prevDocument?, currentUser, collection ]
    // note: we are not interested in prevDocument, and it MAY not exist...
    const [ document ] = callbackArgs;
    const [ collection, currentUser ] = [...callbackArgs].reverse();

    // note: the weird manipulation comes from the way we handle callback with
    // list of arguments instead of an object with approriate keys
    // ("old js way" vs "es-next way")

    // edge case: user creation, there is no 'currentUser' at this time...
    const user = operation.includes('users.new') ? document : currentUser;

    const hasAlreadyTrophy =
      user.trophies &&
      user.trophies.find(userTrophy => userTrophy.trophyId === trophy._id);

    // exit if the user already has the trophy
    if (hasAlreadyTrophy) {
      // uncomment for debug
      // console.log(`// User ${user.displayName} (${user._id}) already has trophy ${trophy.slug}.`);

      return;
    }

    // the user deserves to earn this trophy, yay!
    if (!!trophyCondition(document, user, collection)) {
      Users.update(
        { _id: user._id },
        { $addToSet: {
            trophies: { trophyId: trophy._id, earnedAt: new Date() },
          },
        },
      );

      // uncomment for debug
      // console.log(`// User ${user.displayName} (${user._id}) update with trophy ${trophy.slug}.`);
    }

    return document;
  }

  // add the callback to the registry
  addCallback(`${operation}.async`, callbackTorun);
};

export { addTrophy };
