angular.module('iaas-collaboratif').filter('displayMail', function () {
  return function (user) {
    if (!user) {
      return '';
    }

    if (user.emails) {
      return user.emails[0].address;
    }
    else {
      return user;
    }
  }
});