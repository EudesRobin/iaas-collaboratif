angular.module('iaas-collaboratif').directive('user', function () {
	return {
		restrict: 'E',
		templateUrl: 'client/user/paneluser.html',
		controllerAs: 'user',
		controller: function ($scope, $reactive, $modal) {
			$reactive(this).attach($scope);

			this.subscribe('users');

			this.helpers({
				users: () => {
					return Meteor.users.find({});
				},
				isLoggedIn: () => {
					return Meteor.userId() !== null;
				},
				currentUserId: () => {
					return Meteor.userId();
				},
				currentUser: () => {
					return Meteor.users.findOne(Meteor.userId());
				},
				machines: () => {
					return Machines.find({user_id: Meteor.userId()});
				}
			});

			this.machinesIsEmpty = () => {
				return Machines.find({user_id: Meteor.userId()}).fetch().length == 0;
			}

			this.getRowClass = (machine) => {
				if(machine.state==="up"){
					return "success";
				}
				else if(machine.state==="initial"){
					return "warning";
				}
				else{
					return "danger";
				}
			}

			this.save = () => {
				this.currentUser.getSubscriber().setFields(this.currentUser.subscriber);
			};

			this.insertMachine = () => {
				this.save();
				if(this.machinetypeSelect!='other')
					this.newMachine.machinetype=this.machinetypeSelect;
				else
					this.newMachine.machinetype=this.machinetypeInput;
				this.newMachine.machinename=this.currentUser.username;
				for(i=0;i<this.machineNumber;i++)
					this.currentUser.getSubscriber().allocate(this.newMachine);
				// reset form
				document.getElementById("machineType").value = "";
				document.getElementById("nbmch").value = "";
				this.newMachine={};
			};


			this.action_user = (cmd,param) => {
				cmd_concat=cmd+'_user';
				Meteor.call('exec_cmd',cmd_concat,param, function (err, response) {
					if(err){
						var title;
						switch(cmd){
							case "sendkey":
							title = "Error sending key"
							break;
							case "create":
							title = "Error creation instance"
							break;
							case "stop":
							title = "Error kill instance"
							break;
							case "remove":
							title = "Error remove instance"
							break;						
							default:
							title = "Error unknown command"
						}
						$.notify({
							// options
							icon: 'glyphicon glyphicon-remove-sign',
							title: title+"<br>",
							message: err.details,
						},{
							//settings
							type: 'danger',
							newest_on_top: true,
							allow_dismiss: true,
							template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
							'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
							'<span data-notify="icon"></span> ' +
							'<span data-notify="title">{1}</span> ' +
							'<span data-notify="message">{2}</span>' +
							'</div>' ,
						});
					}

					if(response){
						var title;
						// redef - 4debug
						var msg="successful";
						switch(cmd){
							case "sendkey":
							title = "Key sent<br>"
							msg= response;
							break;
							case "create":
							title = "Creation instance<br>"
							msg= response;
							break;
							case "stop":
							title = "Kill instance<br>"
							msg= response;
							break;
							case "remove":
							title = "Remove instance<br>"
							msg=response;
							break;
							default:
							title = "Unknown command"
						}
						$.notify({
							// options
							icon: 'glyphicon glyphicon-ok-sign',
							title: title,
							message: msg,
						},{
							//settings
							type: 'success',
							newest_on_top: true,
							allow_dismiss: true,
							template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
							'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
							'<span data-notify="icon"></span> ' +
							'<span data-notify="title">{1}</span> ' +
							'<span data-notify="message">{2}</span>' +
							'</div>' ,
						});
					}
				});
			};

		this.throw_error = (cmd,params) => {
			var title;
			switch(cmd){
				case "create":
				title = "Error creation instance"
				break;
				case "stop":
				title = "Error kill instance"
				break;
				case "remove":
				title = "Error remove instance"
				break;						
				default:
				title = "Error Unknown command"
			}
			$.notify({
												// options
												icon: 'glyphicon glyphicon-remove-sign',
												title: title+"<br>",
												message: params,
											},{
												//settings
												type: 'danger',
												newest_on_top: true,
												allow_dismiss: true,
												template: '<div data-notify="container" class="col-xs-6 col-sm-3 alert alert-{0}" role="alert">' +
												'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
												'<span data-notify="icon"></span> ' +
												'<span data-notify="title">{1}</span> ' +
												'<span data-notify="message">{2}</span>' +
												'</div>' ,
											});
		};


		this.startMachine = (machine) => {
			this.save();
			temp_machine = Ressources.find({_id: machine.ressource_id}).fetch()[0];

			if (temp_machine.usable){
				machine.state='up';
				Machines.update({_id: machine._id}, {$set:{state:machine.state}}, (error) => {
					if (error) this.throw_error('create','Unable to start machine');
					else this.action_user('create',machine.machinetype+' 1 '+machine.machinename+' '+machine.ram+'G '+machine.cpunumber+' '+temp_machine.ram.total+'G');
				});
			}
		};


		this.stopMachine = (machine) => {
			machine.state='down';
			Machines.update({_id: machine._id}, {$set:{state:machine.state}}, (error) => {
				if (error) this.throw_error('stop','Unable to stop machine');
				else this.action_user('stop',machine);
			});
		};

		this.deleteMachine = (machine) => {
			this.save();
			this.currentUser.getSubscriber().desallocate(machine);
			// notif done in subscriber.js
		};		

		this.generate = (machine) => {

			makeTextFile = function (text) {
				var data = new Blob([text], {type: 'text/plain'});
				if (textFile !== null) {
					window.URL.revokeObjectURL(textFile);
				}
				var textFile = window.URL.createObjectURL(data);
				return textFile;
			};

			function downloadURI(uri, name) {
				var link = document.createElement("a");
				link.download = name;
				link.href = uri;
				link.click();
			}

			var ssh_string='# Host is an alias , Hostname is the name of the user instance\n';
			ssh_string+='# We presume that you private key is  ~/.ssh/client_pk\n';
			ssh_string+='# To ssh your instance : type the following command\n';
			ssh_string+='# ssh -F iaas-'+machine.machinename+'.config '+machine.machinename+'\n';
			ssh_string+='Host '+machine.machinename+'\n';
			ssh_string+='\tHostname '+machine.machinename+'\n';
			ssh_string+='\tStrictHostKeyChecking no\n';
			ssh_string+='\tProxyCommand  ssh -o "StrictHostKeyChecking no" -i "~/.ssh/client_pk" iaas-client@'+machine.dns+' netcat -w 120 %h %p\n';
			ssh_string+='\tUser iaas-client\n';
			ssh_string+='\tStrictHostKeyChecking no\n';
			ssh_string+='\tIdentityFile ~/.ssh/client_pk';

			downloadURI(makeTextFile(ssh_string),'iaas-'+machine.machinename+'.config');
		};

		this.generate_all = () => {

			makeTextFile = function (text) {
				var data = new Blob([text], {type: 'text/plain'});
				if (textFile !== null) {
					window.URL.revokeObjectURL(textFile);
				}
				var textFile = window.URL.createObjectURL(data);
				return textFile;
			};

			function downloadURI(uri, name) {
				var link = document.createElement("a");
				link.download = name;
				link.href = uri;
				link.click();
			}

			var ssh_string="";
			ssh_string+='# Host is an alias , Hostname is the name of the user instance\n';
			ssh_string+='# We presume that you private key is  ~/.ssh/client_pk\n';
			ssh_string+='# To ssh your instance :\n';
			ssh_string+='# ssh -F <config_file> <instance_name>\n';

			for(i=0;i<this.machines.length;i++){
				var machine = this.machines[i];
				ssh_string+='#Instance '+machine.machinename+'\n';
				ssh_string+='Host '+machine.machinename+'\n';
				ssh_string+='\tHostname '+machine.machinename+'\n';
				ssh_string+='\tStrictHostKeyChecking no\n';
				ssh_string+='\tProxyCommand  ssh -o "StrictHostKeyChecking no" -i "~/.ssh/client_pk" iaas-client@'+machine.dns+' netcat -w 120 %h %p\n';
				ssh_string+='\tUser iaas-client\n';
				ssh_string+='\tStrictHostKeyChecking no\n';
				ssh_string+='\tIdentityFile ~/.ssh/client_pk\n';
			}

			downloadURI(makeTextFile(ssh_string),'iaas-'+this.currentUser.username+'.config');
		};
	}
}
});