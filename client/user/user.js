var userapp = angular.module('githubscout.user', ['ui.router','nvd3ChartDirectives'])
<<<<<<< HEAD
=======

  function ExampleCtrl($scope){
              $scope.exampleData = [
                  {
                      "key": "Series 1",
                      "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] ]
                  },
                  {
                      "key": "Series 2",
                      "values": [ [ 1025409600000 , 0] , [ 1028088000000 , 0] , [ 1030766400000 , 0] , [ 1033358400000 , 0] , [ 1036040400000 , 0] , [ 1038632400000 , 0] , [ 1041310800000 , 0] , [ 1043989200000 , 0] , [ 1046408400000 , 0] , [ 1049086800000 , 0] , [ 1051675200000 , 0] , [ 1054353600000 , 0] , [ 1056945600000 , 0] , [ 1059624000000 , 0] , [ 1062302400000 , 0] , [ 1064894400000 , 0] , [ 1067576400000 , 0] , [ 1070168400000 , 0] , [ 1072846800000 , 0] , [ 1075525200000 , -0.049184266875945] ]
                 },
                 {
                     "key": "Series 3",
                     "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] ]
                 },
                 {
                     "key": "Series 4",
                     "values": [ [ 1025409600000 , -7.0674410638835] , [ 1028088000000 , -14.663359292964] , [ 1030766400000 , -14.104393060540] , [ 1033358400000 , -23.114477037218] , [ 1036040400000 , -16.774256687841] , [ 1038632400000 , -11.902028464000] , [ 1041310800000 , -16.883038668422] , [ 1043989200000 , -19.104223676831] , [ 1046408400000 , -20.420523282736] , [ 1049086800000 , -19.660555051587] , [ 1051675200000 , -13.106911231646] , [ 1054353600000 , -8.2448460302143] , [ 1056945600000 , -7.0313058730976] ]
                 }
             ];

              var colorArray = ['#FF0000', '#0000FF', '#FFFF00', '#00FFFF'];
             $scope.colorFunction = function() {
               return function(d, i) {
                   return colorArray[i];
               };
             }
 }


>>>>>>> Added some nvd3 additions

userapp.controller('UserController', ['$scope', 'UserData', 'UserSearch', 'UserDateandCommits','UserLanguagesandCommits','UserCompareRescaleBar',function($scope, UserData, UserSearch, UserDateandCommits,UserLanguagesandCommits,UserCompareRescaleBar) {
  $scope.userdata ={};
  $scope.username = UserData.username
  $scope.userdata.data = UserData.rawDataCommitsByLanguage
  //This will render text as indicated when the "search" button is clicked for second user 
  $scope.newDiv=function(){
             $scope.items= {title: 'GitHub User '+ $scope.userdata.nextUsername + ' Commits By Langauges'}
        }
   $scope.getCompareRescaleBar = function(firstUserData,secondUserData){
       return UserCompareRescaleBar.getCompareRescaleBar($scope.userDateandCommits, secondUserData)
   }

  $scope.getdateandCommits = function(data){
    return UserDateandCommits.getdateandCommits(data)
  }

  $scope.getUserCommitsperLanganguage = function(data){
    return UserLanguagesandCommits.getUserCommitsperLanganguage(data)
  }

  $scope.userDateandCommits=$scope.getdateandCommits($scope.userdata.data).reverse()
  $scope.commitsperLangugageData = $scope.getUserCommitsperLanganguage($scope.userdata.data)

   //Data for first user bar chart.

  $scope.commitsbyDateData =[{"key": UserData.username,"values": $scope.userDateandCommits}];
  // Function grabs second user's data from compare user input to compare with first user on same commits over time chart
  $scope.addUser = function() {
    console.log('addUser')
    UserSearch.getUserCommitsByLanguage({username: $scope.userdata.nextUsername})
      .then(function (data) {
        $scope.secondUserDateandCommits = $scope.getdateandCommits(data).reverse()
        $scope.CombinedNewandOldUserDatesData = $scope.getCompareRescaleBar( $scope.userDateandCommits,$scope.secondUserDateandCommits)
        $scope.commitsbyDateData =
          [{
           key: UserData.username,
           values: $scope.CombinedNewandOldUserDatesData 
          },
          {
            key: $scope.userdata.nextUsername,
            values: $scope.secondUserDateandCommits
          }];
          //gets data for second user's commits by language
        $scope.commitsperLangugageDataUser2 = $scope.getUserCommitsperLanganguage(data)
        
      })
  }
  //Function that allows nvd3 and d3 to access x values from the ‘data’.
  $scope.xFunction = function() {
    return function(d) {
      return d.language;
    };
  }
  //Function that allows nvd3 and d3 to access y values from the ‘data’.
  $scope.yFunction = function() {
    return function(d) {
      return d.count;
    };
  }
}]);
