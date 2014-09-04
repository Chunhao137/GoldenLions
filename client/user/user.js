var userapp = angular.module('githubscout.user', ['ui.router','nvd3ChartDirectives'])

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



userapp.controller('UserController', ['$scope', 'UserData', 'getUserCommits', function($scope, UserData) {
  $scope.userdata =[];
  $scope.userdata.data = UserData.rawDataCommitsByLanguage

  // getdateandCommits will return an array of object with object having the form {date:'2014-06-04', count:5}
  var getdateandCommits  = function(){
    console.log('user, getdateandCommits')
    var result = []
    var commit = {};
   for(var i =0; i<$scope.userdata.data.length; i++){
     var repo = $scope.userdata.data[i]
      for(var key in repo){
          if(key === "date"){
             if(commit[repo[key]]){
                commit[repo[key]]++;
             }else{
                commit[repo[key]]=1;
             }
          }
      }
    }
    for(var key in commit){
        result.push({date:key,count:commit[key]})
    }
    return result
  }
  // getUserCommitsperLanganguage will return an array of object with object having the form {language:'JavaScript', count:10}
  var getUserCommitsperLanganguage = function(){
    console.log('user, getUserCommitsperLanganguage')
      var result = []
      var commit ={}
      for(var i=0; i<$scope.userdata.data.length;i++){
        var repo = $scope.userdata.data[i].languages;
        for(var key in repo){
             if(commit[key]){
                commit[key]++
             }else{
               commit[key]=1
             }
         }

      }
      for(var key in commit){
         result.push({language:key,count:commit[key]})
      }
      return result;
  }

  $scope.userDateandCommits = getdateandCommits().reverse()
  $scope.userCommitsperLanguage = getUserCommitsperLanganguage()


}])

//creating the d3 directive for commits for specific user
userapp.directive('usercommitChart', function($window){
   return{
      restrict:'EA',
      template:"<svg width='960' height='600'></svg>",
       link: function(scope, elem, attrs){

          console.log('user, usercommitChart')
           var dataPlot=scope.userDateandCommits

           var padding = 20;
           var pathClass="path";
           var xScale, yScale, xAxisGen, yAxisGen

           var d3 = $window.d3;
           //console.log("window",$window)

           var rawSvg=elem.find('svg');
           var svg = d3.select(rawSvg[0]);
          // console.log("rawSVG",rawSvg[0])

           //setting up the axis and labeling it

           function setChartParameters(){

             xScale = d3.scale.linear()
             .domain([0, dataPlot.length-1])
             .range([padding + 5, rawSvg.attr("width") - padding]);

             yScale = d3.scale.linear()
             .domain([0, d3.max(dataPlot, function (d) {

               return parseInt(d.count);
             })])
             .range([400 - padding, 0]);

             xAxisGen = d3.svg.axis()
             .scale(xScale)
             .tickFormat(function(d,i) { return dataPlot[d].date})
             .orient("bottom")
             .ticks(dataPlot.length - 1);


                   yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5)

                 }

                 function drawLineChart() {


                   setChartParameters();

                   svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(10,380)")
                   .call(xAxisGen)
                   .selectAll("text")
                   .style("text-anchor", "end")
                   .attr("dx", "-.8em")
                   .attr("dy", ".15em")
                   .attr("transform", function(d) {
                     return "rotate(-65)"
                   });


                   svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(40,0)")
                   .call(yAxisGen);

               svg.selectAll('bar')
                  .data(dataPlot)
                  .enter()
                  .append('rect')
                  .attr("x",function(d,i){return (0.94*i*rawSvg.attr("width"))/(dataPlot.length - 1)})
                  .attr('width',20)
                  .attr('height',0)
                  .attr("transform", "translate(40,0)")
                  .attr('fill','steelblue')
                  .transition()
                  .delay(function(d, i) { return i * 100; })
                  .duration(500)
                  .attr('y',function(d){ return yScale(d.count)})
                  .attr('height',function(d,i){return 380-yScale(d.count) })

           }

           drawLineChart();
       }
   };
})

//creating the d3 directive commites for languages for specific user
userapp.directive('userlangaugeChart', function($window){
   return{
      restrict:'EA',
      template:"<svg width='1200' height='600'></svg>",
       link: function(scope, elem, attrs){

          console.log('user, userlangaugeChart')
           var dataPlot=scope.userCommitsperLanguage

          //console.log("this is the scope",dataPlot)
           var padding = 20;
           var pathClass="path";
           var xScale, yScale, xAxisGen, yAxisGen

           var d3 = $window.d3;
           //console.log("window",$window)

           var rawSvg=elem.find('svg');
           var svg = d3.select(rawSvg[0]);
          // console.log("rawSVG",rawSvg[0])

           //setting up the axis and labeling it

           function setChartParameters(){

             xScale = d3.scale.linear()
             .domain([0, dataPlot.length-1])
             .range([padding + 5, rawSvg.attr("width") - padding]);

             yScale = d3.scale.linear()
             .domain([0, d3.max(dataPlot, function (d) {

               return parseInt(d.count);
             })])
             .range([400 - padding, 0]);

             xAxisGen = d3.svg.axis()
             .scale(xScale)
             .tickFormat(function(d,i) { return dataPlot[d].language})
             .orient("bottom")
             .ticks(dataPlot.length - 1);

                   yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5)

                 }

                 function drawLineChart() {


                   setChartParameters();

                   svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(10,380)")
                   .call(xAxisGen)
                   .selectAll("text")
                   .style("text-anchor", "end")
                   .attr("dx", "-.8em")
                   .attr("dy", ".15em")
                   .attr("transform", function(d) {
                     return "rotate(-65)"
                   });


                   svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(40,0)")
                   .call(yAxisGen);

               svg.selectAll('bar')
                  .data(dataPlot)
                  .enter()
                  .append('rect')
                  .attr("x",function(d,i){return (0.94*i*rawSvg.attr("width"))/(dataPlot.length - 1)})
                  .attr('width',20)
                  .attr('height',0)
                  .attr("transform", "translate(40,0)")
                  .attr('fill','steelblue')
                  .transition()
                  .delay(function(d, i) { return i * 100; })
                  .duration(500)
                  .attr('y',function(d){ return yScale(d.count)})
                  .attr('height',function(d,i){return 380-yScale(d.count) })

           }

           drawLineChart();
       }
   };
})
