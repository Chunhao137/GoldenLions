var userapp = angular.module('githubscout.user', ['ui.router','nvd3ChartDirectives'])


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
  $scope.exampleData = [
      { key: "One", y: 5 },
          { key: "Two", y: 2 },
          { key: "Three", y: 9 },
          { key: "Four", y: 7 },
          { key: "Five", y: 4 },
          { key: "Six", y: 3 },
          { key: "Seven", y: 9 }
    ];
             // $scope.xAxisTickFormatFunction = function(){
             //     return function(d){
             //      console.log("date",d.date)
             //         return d.date;
             //     }
             // }

             // $scope.yAxisTickFormatFunction = function(){
             //     return function(d){
             //      console.log("count",d.count)
             //         return d.count;
             //     }
             // }
           

           $scope.descriptionFunction = function(){
               return function(d){
                   return d.language;
               }
           }

          var colorArray = ['#000000', '#660000', '#CC0000', '#FF6666', '#FF3333', '#FF6666', '#FFE6E6'];
          $scope.colorFunction = function() {
            return function(d, i) {
                return colorArray[i];
              };
          }
  


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
