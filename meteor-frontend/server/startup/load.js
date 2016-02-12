
//http://eureka.ykyuen.info/2015/02/26/meteor-run-shell-command-at-server-side/

Meteor.startup(function () {
  // Load future from fibers
  var Future = Npm.require("fibers/future");
  // Load exec
  var exec = Npm.require("child_process").exec;
  
  // Server methods
  Meteor.methods({
    exec_cmd: function (cmd, params) {
      // This method call won't return immediately, it will wait for the
      // asynchronous code to finish, so we call unblock to allow this client
      // to queue other method calls (see Meteor docs)
      this.unblock();
      var future=new Future();

      var command;
      switch (cmd) {
        case "stop":
        command="ssh nodetest@nodetest 'docker exec  coordinator ssh iaas@172.17.0.1 /home/iaas/stop.sh "+params+"'";
        break;
        case "create":
        command="ssh nodetest@nodetest 'docker exec  coordinator ssh iaas@172.17.0.1 /home/iaas/start.sh "+params+"'";
        break;
        case "test":
        command="echo "+params;
        break;
        default:
        return;
      }

      exec(command,function(error,stdout,stderr){
        if(error){
          console.log(error);
          throw new Meteor.Error(500,command+" failed");
        }
        
        future.return(stdout.toString());
      });
      return future.wait();
    }
  });
});
