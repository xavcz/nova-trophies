import { addCallback } from 'meteor/nova:core';
import Users from 'meteor/nova:users';
import { Trophies } from './collection';

const addTrophy = ({
  operation: callbackOperation, 
  slug: trophySlug, 
  condition: trophyCondition
}) => {
  if (typeof trophyCondition !== 'function') {
    // eslint-disable-next-line
    console.error(`
      Error on ${trophySlug}, callback ${callbackOperation}.
      The trophy condition needs to be a function!!`);
    return;
  }
  
  // get the relevant trophy
  const trophy = Trophies.findOne({ slug: trophySlug });
  
  // exit if the trophy doesn't exist
  if(!trophy) {
    // eslint-disable-next-line
    console.warn(`${callbackOperation} tried to run for an undefined trophy: ${trophySlug}`);
    
    return;
  }
  
  const callbackTorun = (...callbackArgs) => {
    // extract document, currentUser & collection from the callback arguments
    // => callbackArgs = [ document, prevDocument?, currentUser, collection ]
    // note: we are not interested in prevDocument, and it MAY not exist... 
    const [ document ] = callbackArgs;   
    const [ collection, currentUser ] = [...callbackArgs].reverse();
    
    // edge case: user creation, there is no 'currentUser' at this time...
    const user = callbackOperation.includes('users.new') ? document : currentUser;
    
    const hasAlreadyTrophy = 
      user.trophies && 
      user.trophies.find(userTrophy => userTrophy.trophyId === trophy._id);
    
    // exit if the user already has the trophy
    if (hasAlreadyTrophy) {
      // uncomment for debug
      // eslint-disable-next-line
      console.log(`// User ${user.displayName} (${user._id}) already has trophy ${trophy.slug}.`)

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
      // eslint-disable-next-line
      console.log(`// User ${user.displayName} (${user._id}) update with trophy ${trophy.slug}.`)
    }
  }
  
  // add the callback to the registry
  addCallback(`${callbackOperation}`, callbackTorun);
};

export { addTrophy };
