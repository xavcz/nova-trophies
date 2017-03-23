import Users from 'meteor/vulcan:users';

const adminsActions = [
  "trophies.new",
  "trophies.edit",
  "trophies.remove",
];

Users.groups.admins.can(adminsActions);
