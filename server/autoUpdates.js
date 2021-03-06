var google = require('googleapis');
var http = require('http');
var fs = require('fs');
var bigquery = new google.bigquery('v2');

//Setup all of our authentication variables.
//They are all grabbed from google developer console account website: 
//https://console.developers.google.com/project/apps~agile-binder-688/apiui/credential?authuser=0
var CLIENT_ID = "314338891317-a4n22257s5btge0qi4mev6vp99mepl9t.apps.googleusercontent.com";
var CLIENT_SECRET = "_FW5deWK4e3fizF8n9VDi9j0";
var datasetID = 'githubscout'
var projectID = 'agile-binder-688'
var SERVICE_ACCOUNT_EMAIL = '314338891317-u8v8evcg11jpfn8ukkdkbh25p53h84ua@developer.gserviceaccount.com'
var SERVICE_ACCOUNT_KEY_FILE = './server/googleapi-privatekey.pem'//might be hidden
var scopes = ['https://www.googleapis.com/auth/bigquery','https://www.googleapis.com/auth/cloud-platform'];
//create an oauth2 object for authentication. We just need to add an access_token property now
var oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'postmessage');
//create a JWT object with our service account email and private key.
var JWT = new google.auth.JWT(
	SERVICE_ACCOUNT_EMAIL,
	SERVICE_ACCOUNT_KEY_FILE,
	null,
	scopes);
// console.log('outside makeFile: JWT: ',JWT)
var updater = {};

//thequery: 'SELECT * FROM [githubscout.distinct_users_pushing_by_month_and_language] LIMIT 3500;'
//thefileName: 'usersPushingByMonthAndLanguage2.json'
updater.makeFile = function(myQuery,fileName){
	// console.log('inside makeFile: JWT:',JWT)
	JWT.authorize(function(err,data){
		console.log('data:'+data);
		//set our oauth2 access token property
		oauth2.setCredentials({
			access_token: data.access_token
		});
		console.log('our access token: '+data.access_token)
		// console.log('does jobs.query exist: '+bigquery.jobs.query);
		// //attempts to create query job
		bigquery.jobs.insert({
			auth: oauth2,
			projectId: projectID,
			resource: {
				configuration: {
					query: {query: myQuery}
				}
			},
			media: {}
		}, function(err,data){
			if(err)console.log(err);
			var jobID = data['jobReference']['jobId'];
			bigquery.jobs.getQueryResults({
				auth: oauth2,
				jobId: jobID,
				projectId: projectID,
			},function(err,data){
				if(err){console.log(err)}
				fs.writeFile(fileName,
					JSON.stringify(data),
					function(err){
						if(err)console.log(err);
						console.log('Saved!!!!!!!!!!')
					})
			});
		})	
	})
}
// JWT.authorize(function(err,data){
// 	console.log('our access token: '+data.access_token)
// 	//set our oauth2 access token property
// 	oauth2.setCredentials({
// 		access_token: data.access_token
// 	});
// 	// console.log('does jobs.query exist: '+bigquery.jobs.query);
// 	// //attempts to create query job
// 	bigquery.jobs.insert({
// 		auth: oauth2,
// 		projectId: projectID,
// 		resource: {
// 			configuration: {
// 				query: {query: 'SELECT * FROM [githubscout.distinct_users_pushing_by_month_and_language] LIMIT 3500;'}
// 			}
// 		},
// 		media: {}
// 	}, function(err,data){
// 		if(err)console.log(err);
// 		var jobID = data['jobReference']['jobId'];
// 		bigquery.jobs.getQueryResults({
// 			auth: oauth2,
// 			jobId: jobID,
// 			projectId: projectID,
// 		},function(err,data){
// 			if(err){console.log(err)}
// 			fs.writeFile('usersPushingByMonthAndLanguage2.json',
// 				JSON.stringify(data),
// 				function(err){
// 					if(err)console.log(err);
// 					console.log('Saved!!!!!!!!!!')
// 				})
// 		});
// 	})	
// })

module.exports = updater;
