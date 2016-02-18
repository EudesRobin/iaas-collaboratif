
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

      // check if value is int
      // https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
      function isInt(value) {
        if (isNaN(value)) {
          return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
      }

      switch (cmd) {
        case "stop":
        var r_split = params.split(" ");
        if(r_split.length!=1){
          throw new Meteor.Error(500,r_split.length,"Invalid parameter length");
        }
        //command="ssh nodetest@nodetest 'docker exec  coordinator ssh iaas@172.17.0.1 /home/iaas/stop.sh "+params+"'";
        command="echo stop.sh "+params;
        break;
        case "create":
        var r_split = params.split(" ");
        if(r_split.length!=6){
          throw new Meteor.Error(500,r_split.length,"Invalid parameters length");
        }
        // Number of containers to be launched
        if(!isInt(r_split[1])){
          throw new Meteor.Error(500,r_split[1],"Invalid number of containers");
        }
        // Memory of 1 container soft limit
        var sub_str=r_split[3].split("");
        var l_sub_str=sub_str.length;
        if(l_sub_str<2){
          throw new Meteor.Error(500,r_split[3],"Invalid memory container parameter");
        }
        // check unit
        if(["b","k","m","g"].indexOf(sub_str[l_sub_str-1].toLowerCase())+1){
          if(!isInt(r_split[3].split(sub_str[l_sub_str-1])[0])){
            throw new Meteor.Error(500,r_split[3],"Invalid memory container parameter - Invalid limit value");
          }
        }else{
          throw new Meteor.Error(500,r_split[3],"Invalid memory container parameter - Invalid Unit");
        }
        // Number of CPU going to be used by 1 container
        if(!isInt(r_split[4])){
          throw new Meteor.Error(500,r_split[4],"Invalid value of CPU used by 1 container");
        }
        // Memory available set by the collaborator hard limit
        var sub2_str=r_split[5].split("");
        var l_sub2_str=sub2_str.length;
        if(l_sub2_str<2){
          throw new Meteor.Error(500,r_split[5],"Invalid memory container parameter");
        }
        // check unit
        if(["b","k","m","g"].indexOf(sub2_str[l_sub2_str-1].toLowerCase())+1){
          if(!isInt(r_split[5].split(sub2_str[l_sub2_str-1])[0])){
            throw new Meteor.Error(500,r_split[5],"Invalid memory container parameter - Hardlimit - Invalid limit value");
          }
        }else{
          throw new Meteor.Error(500,r_split[5],"Invalid memory container parameter - Hardlimit - Invalid unit");
        }
        //command="ssh nodetest@nodetest 'docker exec  coordinator ssh iaas@172.17.0.1 /home/iaas/start.sh "+params+"'";
        command=" echo start "+params;
        break;
        case "test_valid":
        command="echo "+params;
        break;
        case "test_error":
        throw new Meteor.Error(500,params,"details error");
        break;
        case "create_error":
        throw new Meteor.Error(500,"create","Unable to start this instance");
        break;
        case "stop_error":
        throw new Meteor.Error(500,"stop","Unable to stop this instance");
        break;
        case "remove":
        command="echo "+params;
        break;
        case "remove_error":
        throw new Meteor.Error(500,"remove","Unable to remove this instance");
        case "launch_machine":
        //command="~/iaas-collaboratif/scripts/createKey.sh "+params;
        command= "echo toto";
        break;
        default:
        return;
      }

      exec(command,function(error,stdout,stderr){
        if(error){
          throw new Meteor.Error(500,command+" failed");
        }

        future.return(stdout.toString());
      });
      return future.wait();
    }
  });
});
