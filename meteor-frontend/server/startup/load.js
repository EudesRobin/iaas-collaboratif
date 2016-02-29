
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
        // TEST CMD
        case "create_test":
        command="ssh nodetest@nodetest 'ssh -p 22000 iaas@172.17.0.1 /home/iaas/start.sh "+params+"'";
        break;
        case "stop_test":
        command="ssh nodetest@nodetest 'ssh -p 22000 iaas@172.17.0.1 /home/iaas/stop.sh "+params+"'";
        break;

        // USER CMD
        case "stop_user":
        var r_split = params.machinename.split(" ");
        if(r_split.length!=1){
          throw new Meteor.Error(500,r_split.length,'Invalid parameter length');
        }
        command="ssh client-iaas@"+params.dns+" 'ssh iaas@172.17.0.1 /home/iaas/stop.sh "+params.machinename+"'";
        break;
        case "create_user":
        var dns = params.split("-")[0].split(" ");
        var r_split=params.split("-")[1].split(" ");
        // var r_split = params.split(" ");
        // if(r_split.length!=6){
        //   throw new Meteor.Error(500,r_split.length,'Invalid parameters length');
        // }
        // // Number of containers to be launched
        // if(!isInt(r_split[1])){
        //   throw new Meteor.Error(500,r_split[1],'Invalid number of containers');
        // }
        // // Memory of 1 container soft limit
        // var sub_str=r_split[3].split("");
        // var l_sub_str=sub_str.length;
        // if(l_sub_str<2){
        //   throw new Meteor.Error(500,r_split[3],'Invalid memory container parameter');
        // }
        // // check unit
        // if(["b","k","m","g"].indexOf(sub_str[l_sub_str-1].toLowerCase())+1){
        //   if(!isInt(r_split[3].split(sub_str[l_sub_str-1])[0])){
        //     throw new Meteor.Error(500,r_split[3],'Invalid memory container parameter - Invalid limit value');
        //   }
        // }else{
        //   throw new Meteor.Error(500,r_split[3],'Invalid memory container parameter - Invalid Unit');
        // }
        // // Number of CPU going to be used by 1 container
        // if(!isInt(r_split[4])){
        //   throw new Meteor.Error(500,r_split[4],'Invalid value of CPU used by 1 container');
        // }
        // // Memory available set by the collaborator hard limit
        // var sub2_str=r_split[5].split("");
        // var l_sub2_str=sub2_str.length;
        // if(l_sub2_str<2){
        //   throw new Meteor.Error(500,r_split[5],'Invalid memory container parameter');
        // }
        // // check unit
        // if(["b","k","m","g"].indexOf(sub2_str[l_sub2_str-1].toLowerCase())+1){
        //   if(!isInt(r_split[5].split(sub2_str[l_sub2_str-1])[0])){
        //     throw new Meteor.Error(500,r_split[5],'Invalid memory container parameter - Hardlimit - Invalid limit value');
        //   }
        // }else{
        //   throw new Meteor.Error(500,r_split[5],'Invalid memory container parameter - Hardlimit - Invalid unit');
        // }
        command="echo ssh client-iaas@"+dns+"'ssh iaas@172.17.0.1 /home/iaas/start.sh "+r_split+"'";
        //command="echo start_user "+params;
        break;
        // case "sendkey_user":
        // command="echo remove_user "+params;
        // break;
        case "remove_user":
        command="echo remove_user "+params;
        break;

        default:
        throw_error('unknown command','nothing to say');
      }

      exec(command,function(error,stdout,stderr){
        if(error){
          future.throw(new Meteor.Error(500,command,error+' '));
        }else{
          future.return(stdout.toString());
        }
      });
      return future.wait();
    }
  });
});
