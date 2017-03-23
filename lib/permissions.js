import Users from 'meteor/nova:users';

const adminsActions = [
  "trophies.new",
  "trophies.edit",
  "trophies.remove",
];

Users.groups.admins.can(adminsActions);
