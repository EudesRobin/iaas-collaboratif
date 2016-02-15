Meteor.publish("users", function () {
  return Users.find({_id: this.userId});
  // return Meteor.users.find({_id: this.userId}, {fields: {emails: 1, profile: 1, provider: 1}}); //
});