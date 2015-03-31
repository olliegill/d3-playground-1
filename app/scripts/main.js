var rn = Math.floor((Math.random() * 150) + 60);
var rs = Math.floor((Math.random() * 11) + 4);
  var t = new Trianglify({
 x_gradient: Trianglify.colorbrewer.Spectral[rs],
    noiseIntensity: 0,
    cellsize: rn
});
var pattern = t.generate(window.innerWidth, window.innerWidth+200);
document.body.setAttribute('style', 'background-image: '+pattern.dataUrl);



var bardata = [];

for (var i = 0; i < 50; i++){
  bardata.push(Math.round(Math.random()*50));
}

bardata.sort(function compareNumbers(a,b){
  return a - b;
});

var margin = {top: 30, right: 30, bottom: 40, left: 50};
var height = 400 - margin.top - margin.bottom,
    width = 500 - margin.left - margin.right,
    barWidth = 50,
    barOffset = 5;

var tempColor;

var colors = d3.scale.linear()
               .domain([0, bardata.length * 0.33, bardata.length * 0.66, bardata.length])
               .range(['#B58929', '#C61C6F', '#268BD2', '#85992C']);

var yScale = d3.scale.linear()
               .domain([0, d3.max(bardata)])
               .range([0, height - 10]);

var xScale = d3.scale.ordinal()
               .domain(d3.range(0, bardata.length))
               .rangeBands([0, width], 0.2);

               var myBarChart = d3.select('#graphic').append('svg')
                 .style('background', '#767676')
                 .attr('width', width + margin.left + margin.right)
                 .attr('height', height + margin.top + margin.bottom)
                 .append('g')
                 .attr('transform', 'translate(' + margin.left +', ' + margin.top + ')')
                 .selectAll('rect').data(bardata)
                 .enter().append('rect')
                   .style('fill', function(d, i){
                     return colors(i);
                   })
                   .attr('width', xScale.rangeBand)
                   .attr('x', function(d, i){
                     return xScale(i);
                   })
                   .attr('height', 0)
                   .attr('y', height)
                 .on('mouseover', function(d){

                   tooltip.transition()
                       .style('opacity', 0.9);

                   tooltip.html(d)
                       .style('left', (d3.event.pageX - 5) + 'px')
                       .style('top', (d3.event.pageY - 25) + 'px');

                   tempColor = this.style.fill;
                   d3.select(this)
                     .style('opacity', 0.5)
                     .style('fill', 'yellow');
                 })
                 .on('mouseout', function(){
                   d3.select(this)
                     .style('opacity', 1)
                     .style('fill', tempColor);
                 });

               var tooltip = d3.select('body').append('div')
                   .style('position', 'absolute')
                   .style('padding', '0 10px')
                   .style('background', 'white')
                   .style('opacity', 0);

               myBarChart.transition()
                   .attr('height', function(d){
                     return yScale(d);
                   })
                   .attr('y', function(d){
                     return height - yScale(d);
                   })
                   .delay(function(d, i){
                     return i*20;
                   })
                   .duration(1000)
                   .ease('elastic');

               var vGuideScale = d3.scale.linear()
                   .domain([0, d3.max(bardata)])
                   .range([height, 0]);

               var vAxis = d3.svg.axis()
                   .scale(vGuideScale)
                   .orient('left')
                   .ticks(10);

               var vGuide = d3.select('svg').append('g');
                   vAxis(vGuide);

                   vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
                   vGuide.selectAll('path')
                       .style({ fill: 'none', stroke:'#000' });
                   vGuide.selectAll('line')
                       .style({stroke:'#000'});

               var hAxis = d3.svg.axis()
                   .scale(xScale)
                   .orient('bottom')
                   .tickValues(xScale.domain().filter(function(d, i){
                     return !(i % (bardata.length/5));
                   }));

               var hGuide = d3.select('svg').append('g'),
                   hAxis;(hGuide),
                   hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')'),
                   hGuide.selectAll('path')
                       .style({ fill: 'none', stroke:'#000' });
                   hGuide.selectAll('line')
                       .style({stroke:'#000'});

               //
               // Force Graph
               //

               var palette = {"lightgray": "#819090","gray": "#708284","mediumgray": "#536870",
                              "darkgray": "#475B62","darkblue": "#0A2933","darkerblue": "#042029",
                              "paleryellow": "#FCF4DC","paleyellow": "#EAE3CB","yellow": "#A57706",
                              "orange": "#BD3613","red": "#D11C24","pink": "#C61C6F","purple": "#595AB7",
                              "blue": "#2176C7","green": "#259286","yellowgreen": "#738A05"};

               var forceWidth = 500,
                   forceHeight = 400;

               var nodeWidth = 5;

               var nodes = [
                 { name: 'Parent' },
                 { name: 'Child 1' },
                 { name: 'Child 2', target: [0]},
                 { name: 'Child 3', target: [0]},
                 { name: 'Child 4', target: [0, 1]},
                 { name: 'Child 5', target: [1]},
                 { name: 'Child 6', target: [0, 1, 2, 3]}
               ];

               var links = [];
               for (var i = 0; i < nodes.length; i++ ){
                 if (nodes[i].target !== undefined){
                   for (var x = 0; x < nodes[i].target.length; x++){
                     links.push({
                       source: nodes[i],
                       target: nodes[nodes[i].target[x]]
                     });
                   }
                 }
               }

               var myForceChart = d3.select('#forcechart').append('svg')
                   .attr('height', forceHeight).attr('width', forceWidth);

               var force = d3.layout.force()
                   .nodes(nodes).links([])
                   .gravity(0.05)
                   .charge(-300)
                   .size([forceWidth, forceHeight]);

               var link = myForceChart.selectAll('line')
                   .data(links).enter().append('line')
                   .attr('stroke', palette.pink);

               var node = myForceChart.selectAll('circle')
                   .data(nodes).enter()
                   .append('g')
                   .call(force.drag);

               node.append('circle')
                   .attr('cx', function(d) { return d.x; })
                   .attr('cy', function(d) { return d.y; })
                   .attr('r', nodeWidth)
                   .attr('fill', function(d, i){
                     if (i > 0) { return palette.mediumgray}
                     else { return palette.yellowgreen}
                   });

               node.append('text')
                   .text(function(d){
                     return d.name;
                   })
                   .attr('font-family','Helvetica')
                   .attr('x', function(d, i){
                     if (i > 0) { return (nodeWidth + 4); }
                     else { return (nodeWidth - 15); }
                   })
                   .attr('y', function(d, i){
                     if (i > 0) { return (nodeWidth); }
                     else { return 8; }
                   })
                   .attr('fill', function(d, i){
                     if (i > 0) { return palette.mediumgray;}
                     else { return palette.yellowgreen;}
                   })
                   .attr('text-anchor', function(d, i){
                     if (i > 0) { return 'beginning';}
                     else { return 'end';}
                   })
                   .attr('font-size', function(d, i){
                     if (i > 0) { return '1em';}
                     else { return '1.5em';}
                   });

               force.on('tick', function(e){
                   node.attr('transform', function(d, i){
                     return 'translate(' + d.x + ', ' + d.y + ')';
                   });
                   link
                     .attr('x1', function(d){ return d.source.x; })
                     .attr('y1', function(d){ return d.source.y; })
                     .attr('x2', function(d){ return d.target.x; })
                     .attr('y2', function(d){ return d.target.y; });
               });

               force.start();

               //
               // Pie Chart
               //

               var pieChartWidth = 400,
                   pieChartHeight = 400,
                   pieRadius = 200,
                   pieColors = d3.scale.category20b();

               var piedata = [
                 {
                   label: "Pie 1",
                   value: 20 + Math.round(Math.random()*15)
                 },{
                   label: "Pie 2",
                   value: 20 + Math.round(Math.random()*5)
                 },{
                   label: "Pie 3",
                   value: 20 + Math.round(Math.random()*5)
                 },{
                   label: "Pie 4",
                   value: 70 + Math.round(Math.random()*5)
                 },{
                   label: "Pie 5",
                   value: 20 + Math.round(Math.random()*5)
                 },{
                   label: "Pie 6",
                   value: 20 + Math.round(Math.random()*5)
                 }
               ];

               var pie = d3.layout.pie()
                   .value(function(d){
                     return d.value;
                   });

               var arc = d3.svg.arc()
                   .outerRadius(pieRadius);

               var myPieChart = d3.select('#piechart').append('svg')
                   .attr('width', pieChartWidth)
                   .attr('height', pieChartHeight)
                   .append('g')
                   .attr('transform', 'translate(' + (pieChartWidth - pieRadius) + ', ' + (pieChartHeight - pieRadius) + ')')
                   .selectAll('path').data(pie(piedata))
                   .enter().append('g')
                     .attr('class', 'slice');

               var slices = d3.selectAll('g.slice')
               .append('path')
                   .attr('fill', function(d, i){
                     return pieColors(i);
                   })
                   .attr('d', arc);

               var pieText = d3.selectAll('g.slice')
                   .append('text')
                   .text(function(d, i){
                     return d.data.label;
                   })
                   .attr('text-anchor', 'middle')
                   .attr('fill', 'white')
                   .attr('transform', function(d){
                     d.innerRadius = 0;
                     d.outerRadius = pieRadius;
                     return 'translate(' + arc.centroid(d) + ')';
                   });

/////////////////////////// PERCENTAGE PIES /////////////////////////////////////////////////

var twoPi = 2 * Math.PI; //for a full circle
var formatPercent = d3.format(".0%");
var percent = [0.75, 0.55, 0.93];

var arc = d3.svg.arc()
            .innerRadius(90)
            .outerRadius(92)
            .startAngle(0);

var svg = d3.select(".percent-pies")
            .append("svg")
            .attr("width", 600)
            .attr("height", 250);

var circleOne = svg.append("g")
                   .attr("transform", "translate(" + 100 + "," + 250 / 2 + ")");

circleOne.append("path")
         .attr("d", arc.endAngle(twoPi))
         .style("fill", "#7f8c8d");

circleOne.append("path")
         .attr("d", arc.endAngle(twoPi * percent[0]))
         .style("fill", "#2C8CC8");

circleOne.append("text")
         .attr("text-anchor", "middle")
         .attr("transform", "translate(0" + "," + "15)")
         .text(formatPercent(percent[0]))
         .style("fill", "#ffffff")
         .style("font-size", "3em");

var circleTwo = svg.append("g")
                   .attr("transform", "translate(" + 300 + "," + 250 / 2 + ")");

circleTwo.append("path")
         .attr("d", arc.endAngle(twoPi))
         .style("fill", "#7f8c8d");

circleTwo.append("path")
         .attr("d", arc.endAngle(twoPi * percent[1]))
         .style("fill", "#C11F72");

circleTwo.append("text")
         .attr("text-anchor", "middle")
         .attr("transform", "translate(0" + "," + "15)")
         .text(formatPercent(percent[1]))
         .style("fill", "#ffffff")
         .style("font-size", "3em");

var circleThree = svg.append("g")
                     .attr("transform", "translate(" + 500 + "," + 250/2 + ")");

circleThree.append("path")
           .attr("d", arc.endAngle(twoPi))
           .style("fill", "#7f8c8d");

circleThree.append("path")
           .attr("d", arc.endAngle(twoPi * percent[2]))
           .style("fill", "#B58929");

circleThree.append("text")
           .attr("text-anchor", "middle")
           .attr("transform", "translate(0" + "," + "15)")
           .text(formatPercent(percent[2]))
           .style("fill", "#ffffff")
           .style("font-size", "3em");

///////////////////////////////////// COLOUR SQUARES ///////////////////////////////////////

  var w = 960,
    h = 500,
    z = 20,
    x = w / z,
    y = h / z;

var svg = d3.select(".colour-squares").append("svg")
    .attr("width", w)
    .attr("height", h);

svg.selectAll("rect")
    .data(d3.range(x * y))
    .enter()
    .append("rect")
    .attr("transform", translate)
    .attr("width", z)
    .attr("height", z)
    .style("fill", function(d) { return d3.hsl(d % x / x * 360, 1, Math.floor(d / x) / y); })
    .style("stroke", "#ffffff")
    .style("stroke-width", "0.1px")
    .on("mouseover", mouseover);

function translate(d) {
  return "translate(" + (d % x) * z + "," + Math.floor(d / x) * z + ")";
}

function mouseover(d) {
  this.parentNode.appendChild(this);

  d3.select(this)
      .style("pointer-events", "none")
      .transition()
      .duration(750)
      .attr("transform", "translate(480,480)scale(23)rotate(180)")
      .transition()
      .delay(1500)
      .attr("transform", "translate(0,0)");
}

//////////////////////////////////// AREA GRAPH ///////////////////////////////////////////////////


var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
    .range([0, width + 300]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.close); });

var svg = d3.select(".area-graph").append("svg")
    .attr("width", width + 300 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tsvdata = d3.tsv.parse(d3.select("#tsv").text());

  tsvdata.forEach(function(d) {
    d.date = parseDate(d.date);
    d.close = +d.close;
  });

  x.domain(d3.extent(tsvdata, function(d) { return d.date; }));
 y.domain([8, d3.max(tsvdata, function(d) { return d.close; })]);

  svg.append("path")
      .datum(tsvdata)
      .attr("class", "area")
      .attr("d", area);

//above eqeals to
/*  svg.append("path")
      .attr("class", "area")
      .attr("d", area(data));
*/
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

////////////////

//var firebase = new Firebase("https://premature-optimization.firebaseio.com/");

////////////////////////////////////
console.log(tsvdata);


// x = d3.scale.linear()
//   .domain([0,d3.max(tsvdata)])
//   .range([0,420]);
//
// d3.select(".bar-chart")
//   .selectAll("div")
//     .data(tsvdata)
//   .enter().append("div")
// .style("width",function(d) { return x(d) + "px";})
// .text(function(d){return d;});


var barData = [5, 10, 44, 8, 10, 11, 12, 15, 31, 11, 24, 13, 14, 18, 22, 23, 20, 25, 23, 16];

var barWidth = 500;
var barHeight = 200;
var barPadding = 3;
var barSvg = d3.select(".bar-chart")
               .append("svg")
               .attr("width", barWidth)
               .attr("height", barHeight);


barSvg.selectAll("rect")
      .data(barData)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return i * (barWidth / barData.length); })
      .attr("y", function(d){
        return barHeight - (d * 4); })
      .attr("width", barWidth / barData.length - barPadding)
      .attr("height", function(d) {
        return d * 4; })
        .attr("fill", function(d) {
          return "rgb(0, 0, " + d * 10 + ")";
        });

barSvg.selectAll("text")
      .data(barData)
      .enter()
      .append("text")
      .text(function(d) {
        return d; })
      .attr("x", function(d, i) {
          return i * (barWidth / barData.length) + 10; })
      .attr("y", function(d){
          return barHeight - (d * 4) + 15; })
      .attr("fill", "white")
      .attr("font-size", "11px")
      .attr("text-anchor", "middle");
