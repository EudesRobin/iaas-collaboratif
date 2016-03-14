
//http://eureka.ykyuen.info/2015/02/26/meteor-run-shell-command-at-server-side/
Meteor.startup(function () {
  // Load future from fibers
  var Future = Npm.require("fibers/future");
  // Load exec
  var exec = Npm.require("child_process").exec;
  
  // Server methods
  Meteor.methods({
  	/**
  	 * Method called from the client side when we want to make a command on the server side among the possible ones
  	 * @param {String} cmd		Command to execute
  	 * @param {String} params	Parameters of the command
  	 * @return 					Result of the executed command
  	 */
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
        // PROVIDER CMD
        case "coordinator_provider":
        var r_split = params.dns.split(" ");

        if(r_split.length!=1){
          throw new Meteor.Error(500,r_split.length,'Invalid parameter length');
        }
        var rename ='ssh -o "StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                      '-o "GlobalKnownHostsFile=/dev/null" -o "UserKnownHostsFile=/dev/null" '+
                      'iaas-admin@'+params.dns+' '+
                  "'ssh -o "+'"StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                      ' -o "UserKnownHostsFile=/dev/null" -o "GlobalKnownHostsFile=/dev/null" '+
                      '-p 22000 iaas@172.17.0.1 docker rename coordinator coordinator-'+params.dns+" ' ";
        command=rename;

        break;
        // USER CMD
        case "stop_user":
        var r_split = params.machinename.split(" ");

        if(r_split.length!=1){
          throw new Meteor.Error(500,r_split.length,'Invalid parameter length');
        }
        var call_stop='ssh -o "StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                      '-o "GlobalKnownHostsFile=/dev/null" -o "UserKnownHostsFile=/dev/null" '+
                      'iaas-admin@'+params.dns+' '+
                  "'ssh -o "+'"StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                      ' -o "UserKnownHostsFile=/dev/null" -o "GlobalKnownHostsFile=/dev/null" '+
                      '-p 22000 iaas@172.17.0.1 /home/iaas/stop.sh '+params.machinename+" ' ";

        var rm_key='ssh -o "StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                      '-o "GlobalKnownHostsFile=/dev/null" -o "UserKnownHostsFile=/dev/null" '+
                      'iaas-admin@'+params.dns+' '+
                  "'ssh -o "+'"StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                      ' -o "UserKnownHostsFile=/dev/null" -o "GlobalKnownHostsFile=/dev/null" '+
                      '-p 22000 iaas@172.17.0.1 \'docker exec -i coordinator-'+params.dns+' "/deletePublicKey.sh"\''+" ' ";

        command=call_stop+' ; '+rm_key;

        break;
        case "watchdog_user":
        var r_split = params.split(" ");

        if(r_split.length!=1){
          throw new Meteor.Error(500,r_split.length,'Invalid parameter length');
        }

        var call_watch='ssh -o "StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                      '-o "GlobalKnownHostsFile=/dev/null" -o "UserKnownHostsFile=/dev/null" '+
                      'iaas-admin@'+params+' '+
                  "'ssh -o "+'"StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                      ' -o "UserKnownHostsFile=/dev/null" -o "GlobalKnownHostsFile=/dev/null" '+
                      '-p 22000 iaas@172.17.0.1 /home/iaas/watchdog.sh '+"'";

        command=call_watch;

        break;
        case "create_user":

        var dns = params.split(" ")[2].split("-");
        var name = dns[0];
        dns.splice(0,1);
        dns.splice(dns.length-1,1);
        dns = dns.join("-");
        
        var r_split=params.split("-")[1].split(" ");
        var r_split = params.split(" ");
        if(r_split.length!=7){
          throw new Meteor.Error(500,r_split.length,'Invalid parameters length');
        }
        // Number of containers to be launched
        if(!isInt(r_split[1])){
          throw new Meteor.Error(500,r_split[1],'Invalid number of containers');
        }
        // Memory of 1 container soft limit
        var sub_str=r_split[3].split("");
        var l_sub_str=sub_str.length;
        if(l_sub_str<2){
          throw new Meteor.Error(500,r_split[3],'Invalid memory container parameter');
        }
        // check unit
        if(["b","k","m","g"].indexOf(sub_str[l_sub_str-1].toLowerCase())+1){
          if(!isInt(r_split[3].split(sub_str[l_sub_str-1])[0])){
            throw new Meteor.Error(500,r_split[3],'Invalid memory container parameter - Invalid limit value');
          }
        }else{
          throw new Meteor.Error(500,r_split[3],'Invalid memory container parameter - Invalid Unit');
        }
        // Number of CPU going to be used by 1 container
        if(!isInt(r_split[4])){
          throw new Meteor.Error(500,r_split[4],'Invalid value of CPU used by 1 container');
        }
        // Memory available set by the collaborator hard limit
        var sub2_str=r_split[5].split("");
        var l_sub2_str=sub2_str.length;
        if(l_sub2_str<2){
          throw new Meteor.Error(500,r_split[5],'Invalid memory container parameter');
        }
        // check unit
        if(["b","k","m","g"].indexOf(sub2_str[l_sub2_str-1].toLowerCase())+1){
          if(!isInt(r_split[5].split(sub2_str[l_sub2_str-1])[0])){
            throw new Meteor.Error(500,r_split[5],'Invalid memory container parameter - Hardlimit - Invalid limit value');
          }
        }else{
          throw new Meteor.Error(500,r_split[5],'Invalid memory container parameter - Hardlimit - Invalid unit');
        }

        // Storage param
        var sub3_str=r_split[6].split("");
        var l_sub3_str=sub3_str.length;
        if(l_sub2_str<2){
          throw new Meteor.Error(500,r_split[6],'Invalid memory container parameter');
        }        
        // check unit
        if(["b","k","m","g"].indexOf(sub3_str[l_sub3_str-1].toLowerCase())+1){
          if(!isInt(r_split[6].split(sub3_str[l_sub3_str-1])[0])){
            throw new Meteor.Error(500,r_split[6],'Invalid storage container parameter - Invalid limit value');
          }
        }else{
          throw new Meteor.Error(500,r_split[6],'Invalid storage container parameter - Invalid unit');
        }

        var getkey = 'bash ~/iaas-collaboratif/scripts/createKey.sh '+name+' '+dns+ ' ; '

        var addk_instance ='ssh  -o "StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5"'+
                              '  -o "UserKnownHostsFile=/dev/null" -o "GlobalKnownHostsFile=/dev/null"  '+
                                'iaas-admin@'+dns+' \'/dividePublicKey.sh /home/iaas-client/'+name+'.pub\' ; ';

        var create_instance = 'ssh  -o "StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                                  ' -o "UserKnownHostsFile=/dev/null" -o "GlobalKnownHostsFile=/dev/null" '+
                                  '  iaas-admin@'+dns+' '+
                            "'ssh -o "+'"StrictHostKeyChecking no" -o "BatchMode=yes" -o "ConnectTimeout=5" '+
                                ' -o "UserKnownHostsFile=/dev/null" -o "GlobalKnownHostsFile=/dev/null"  -p 22000 '+
                                ' iaas@172.17.0.1 /home/iaas/start.sh '+params+" ' ";

        command= getkey+addk_instance+create_instance;
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
    },

    /**
     * If the resource exists, returns its ram.total/storage.total/usable fields
     * Else, returns an error
     * @param {String} ressourceid  Id of the resource which we want infos
     * @return {Object}							Error or required informations
     */
    getInfoFromRessource: function (ressourceid) {
      var tmp=Ressources.findOne({_id: ressourceid});
      if (tmp)
        return {err: null, ram: tmp.ram.total, storage: tmp.storage.total,usable:tmp.usable};
      return {err: "No ressource found"};
    }
  });
});