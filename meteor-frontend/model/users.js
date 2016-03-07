Users = Meteor.users;

// SCHEMA
/**
 * The users inserted in the database will have to follow the schema described
 */
Schemas.Users = new SimpleSchema({
  username: {
      type: String,
      // For accounts-password, either emails or username is required, but not both. It is OK to make this
      // optional here because the accounts-password package does its own validation.
      // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
      optional: true
  },
  emails: {
      type: Array,
      // For accounts-password, either emails or username is required, but not both. It is OK to make this
      // optional here because the accounts-password package does its own validation.
      // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
      optional: true
  },
  "emails.$": {
      type: Object
  },
  "emails.$.address": {
      type: String,
      regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
      type: Boolean
  },
  // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
  registered_emails: { 
      type: [Object], 
      optional: true,
      blackbox: true 
  },
  createdAt: {
      type: Date
  },
  profile: {
      type: Schemas.Users,
      optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  provider : {
    type: Schemas.Providers,
    defaultValue: {},
    optional: true,
  },
  subscriber : {
    type: Schemas.Subscribers,
    defaultValue: {},
    optional: true,
  }
});

/**
 * Set the restrictions for Users database modifications
 */
Users.attachSchema(Schemas.Users,  {transform: true, replace:true});
Users.allow({
    insert: function(userId,doc) {return userId && Meteor.userId() === userId;},
    update: function(userId, doc, fieldNames, modifier) {return userId && Meteor.userId() === userId;},
    remove: function(userId,doc) {return userId && Meteor.userId() === userId;},
    fetch: []
})

// The client gets the users published
if (Meteor.isClient) {
  Meteor.subscribe("users");
}

// ***************************** //
// ** Custom finding function ** //
// ***************************** //
var transform = function (doc) { return new User(doc); };

var find = Meteor.users.find;
var findOne = Meteor.users.findOne;

Meteor.users.find = function (selector, options) {
  selector = selector || {};
  options = options || {};
  return find.call(this, selector, _.extend({transform: transform}, options));
};

Meteor.users.findOne = function (selector, options) {
  selector = selector || {};
  options = options || {};
  return findOne.call(this, selector, _.extend({transform: transform}, options));
};

// ***************************** //
// ******** User object ******** //
// ***************************** //
User = function (opts) {
  _.extend(this, opts);
}

User.prototype.getProvider = function() {
  return new Provider(this);
};

User.prototype.getSubscriber = function() {
  return new Subscriber(this);
};

User.prototype.isSubscriber = function() {
  return this.subscriber != null;
};

User.prototype.isProvider = function() {
  return this.provider != null;
};
