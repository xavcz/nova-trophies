Package.describe({
  name: "xavcz:nova-trophies",
  version: "1.2.0",
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0',
    'nova:users@1.2.0',
  ]);

  api.mainModule('client.js', ['client']);
  api.mainModule('server.js', ['server']);

});
