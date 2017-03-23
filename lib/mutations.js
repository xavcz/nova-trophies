import { newMutation, editMutation, removeMutation, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const performCheck = (mutation, user, document) => {
  if (!mutation.check(user, document)) throw new Error(Utils.encodeIntlError({id: `app.mutation_not_allowed`, value: `"${mutation.name}" on _id "${document._id}"`}));
};

const mutations = {

  new: {

    name: 'trophiesNew',

    check(user, document) {
      if (!user) return false;
      return Users.canDo(user, 'trophies.new');
    },

    mutation(root, {document}, context) {

      performCheck(this, context.currentUser, document);

      return newMutation({
        collection: context.Trophies,
        document: document,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  edit: {

    name: 'trophiesEdit',

    check(user, document) {
      if (!user || !document) return false;
      return Users.canDo(user, `trophies.edit`);
    },

    mutation(root, {documentId, set, unset}, context) {

      const document = context.Trophies.findOne(documentId);
      performCheck(this, context.currentUser, document);

      return editMutation({
        collection: context.Trophies,
        documentId: documentId,
        set: set,
        unset: unset,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

  remove: {

    name: 'trophiesRemove',

    check(user, document) {
      if (!user || !document) return false;
      return Users.canDo(user, `trophies.remove`);
    },

    mutation(root, {documentId}, context) {

      const document = context.Trophies.findOne(documentId);
      performCheck(this, context.currentUser, document);

      return removeMutation({
        collection: context.Trophies,
        documentId: documentId,
        currentUser: context.currentUser,
        validate: true,
        context,
      });
    },

  },

};

export default mutations;
