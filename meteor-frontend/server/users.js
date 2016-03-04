Meteor.publish("users", function () {
  return Users.find({_id: this.userId});
});