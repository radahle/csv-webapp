function readFile(file){
    var reader = new FileReader();
    reader.onload = function(event){
        d3.csv(event.target.result,function (data1) {
// CSV section

  var body = d3.select('#scatter');
	var selectData = [];
   //var data = data1.filter(filterCriteria);
  var data = data1;
  var stringColumn = [];

   for(var element in data1[1]){
           if( data[1].hasOwnProperty(element)) {
               var propValue = data[1][element];
               if(isNaN(propValue)){
                  	stringColumn.push({name:element,values:[]});

                } else{
                	selectData.push(element);
                }
            }


  }

for(var element of data1){
    for(var column of stringColumn){
      
      if(column.values.indexOf(element[column.name])==-1){
        column.values.push(element[column.name]);
      }
  }
}


var dataTest = [];
if(stringColumn.length>0){

  for(var column of stringColumn){
    for(var value of column.values){
      var tempData = data1.filter(function(d){
        return d[column.name]==value;
      });
      //console.log(data1);
      dataTest.push(tempData);
      
    }
  }
  //console.log(stringColumn);
}else{
	dataTest.push(data);
}




   
// check which column is a string and not a number

  

  //console.log(selectData);
  

  //var body = d3.select('body');
  // Select X-axis Variable
  var span = body.append('span')
    .text('Select X-Axis variable: ');
  var yInput = body.append('select')
      .attr('id','xSelect')
      .on('change',xChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d })
      .text(function (d) { return d ;});
  body.append('br');

  // Select Y-axis Variable
  var span = body.append('span')
      .text('Select Y-Axis variable: ');
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d })
      .text(function (d) { return d ;});
  body.append('br');

  // Variables
  //var body = d3.select('body');
  var margin = { top: 50, right: 50, bottom: 50, left: 50 };
  var h = 600 - margin.top - margin.bottom;
  var w = 600 - margin.left - margin.right;
  //var formatPercent = d3.format('.2%');

  var yelement=   d3.select('select#ySelect')[0]['0'].value;
  var xelement=   d3.select('select#xSelect')[0]['0'].value;





  // Scales
  var colorScale = d3.scale.category20();
  var xScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d[xelement] })]),
      d3.max([0,d3.max(data,function (d) { return d[xelement] })*1.3])
      ])
    .range([0,w]);

  var yScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d[yelement] })]),
      d3.max([0,d3.max(data,function (d) { return d[yelement] })*1.3])
      ])
    .range([h,0]);

  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    //.tickFormat(formatPercent)
    .ticks(5)
    .orient('bottom');

  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    //.tickFormat(formatPercent)
    .ticks(5)
    .orient('left');

  // Circles
  var circles = svg.selectAll('circle');
for(var i in dataTest){

      circles.data(dataTest[i])
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d[xelement]) })
      .attr('cy',function (d) { return yScale(d[yelement]) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d) { return colorScale(i) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') 
    .text(function (d) {
    	
    	var tooltip="";
    	for(var element of selectData){
    		tooltip+=element;
    		tooltip+=": \t";
    		tooltip+=d[element];
    		tooltip+="\n";
    	}

    	return tooltip;
    });
}

  // Tooltip
     /* .text(function (d) { return d.variable +
                           '\nReturn: ' + formatPercent(d['Annualized Return']) +
                           '\nStd. Dev.: ' + formatPercent(d['Annualized Standard Deviation']) +
                           '\nMax Drawdown: ' + formatPercent(d['Maximum Drawdown']) });*/
  
           console.log();
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text(d3.select('select#xSelect')[0]['0'].value);
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text(d3.select('select#ySelect')[0]['0'].value);


  // draw legend
  if(stringColumn.length>0){

  var legend = svg.selectAll(".legend")
      .data(stringColumn[0].values)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", w + 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d,i) { return colorScale(i) });

  // draw legend text
  legend.append("text")
      .attr("x", w -24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
  }


  function yChange() {
    var value = this.value; // get the new y value
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[value] })]),
        d3.max([0,d3.max(data,function (d) { return d[value]*1.3 })])
        ]);
    yAxis.scale(yScale); // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1000)
      .call(yAxis);
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value);
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*10})
        .attr('cy',function (d) { return yScale(d[value]) })
  }

  function xChange() {
    var value = this.value; // get the new x value
    xScale // change the xScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[value] })]),
        d3.max([0,d3.max(data,function (d) { return d[value]*1.3 })])
        ]);
    xAxis.scale(xScale); // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .transition().duration(1000)
      .call(xAxis);
    d3.select('#xAxisLabel') // change the xAxisLabel
      .transition().duration(1000)
      .text(value);
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*10})
        .attr('cx',function (d) { return xScale(d[value]) })
  }
});
    }
    reader.readAsDataURL(file);

}

function cleanUp() {
    d3.select('#scatter').remove();
    d3.select('div').append('div').attr('id','scatter')
}