/* DATA
starting from an object describing the possible categories and matching colors
the idea is to fabricate an array of data points with random percentage and count values
*/

console.log("results.js");
console.log("pr", global_state)

let params = new URLSearchParams(window.location.search);
let ma = params.get('m') // 'chrome-instant'
let na = params.get('n') // 'mdn query string'
let ps = params.get('p') // true
let au = params.get('a') // 'chrome-instant'
let ri = params.get('r') // 'mdn query string'


document.getElementById("machiavellinismScore").innerHTML = calcEmojis(Math.floor(ma*10));
document.getElementById("narcisismScore").innerHTML = calcEmojis(Math.floor(na*10));
document.getElementById("psychopathyScore").innerHTML = calcEmojis(Math.floor(ps*10));

function calcEmojis(score) {
  var colorEmoji;
  var baseColor = "⬜️";
  var barChart = "";
  if(score<4){
    colorEmoji = "🟩";
  }else if (score<=7) {
    colorEmoji = "🟨";
  }else{
    colorEmoji = "🟥";
  }
  for (a=0 ; a<score ; a++){
    barChart = barChart + colorEmoji;
  }
  for (b=0 ; b<(10-score) ; b++){
    barChart = barChart + baseColor;
  }
  console.log("here is the barChart ", barChart);
  return barChart;
}

const legend = [
  {
    name: 'You',
    color: 'hsl(28, 99%, 64%)',
  },
  {
    name: 'Hitler',
    color: 'hsl(239, 100%, 50%)',
  },
  {
    name: 'Stalin',
    color: 'hsl(239, 100%, 50%)',
  },
  {
    name: 'Ayn Rand',
    color: 'hsl(239, 100%, 50%)',
  },
  {
    name: 'Bernie Sanders',
    color: 'hsl(239, 100%, 50%)',
  },

];

// utility functions
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

// minimum and maximum values for the percentage and user count
const percentages = {
  min: 0,
  max: 100,
};
const counts = {
  min: 0,
  max: 100,
};

console.log("Hello World on results.js")

const p = [Math.floor(au*100), 90, 90, 10, 15]
const c = [Math.floor(ri*100), 70, 10, 90, 20]
console.log(p)
var index = 0
// function called to fabricate random data points
const randomDataPoint = () => {
  // compute a random percentage and count
  const percentage = p[index];
  const count = c[index];

  // retrieve an item from the legend array
  const item = legend[index];
  index += 1
  /* return an object marrying the name and color with the percentage and user count */
  return Object.assign({}, item, {
    percentage,
    count,
  });
};

// number of data points
const dataPoints = 5;
// create an array of data points leveraging the utility functions
const data = Array(dataPoints).fill('').map(randomDataPoint);


// VIZ
// in the .viz container include an SVG element following the margin convention
const margin = {
  top: 20,
  right: 65,
  bottom: 50,
  left: 65,
};

// the chart ought to be wider than taller
const width = 600 - (margin.left + margin.right);
const height = 400 - (margin.top + margin.bottom);

const svg = d3
  .select('.viz')
  .append('svg')
  .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

const group = svg
  .append('g')
  .attr('transform', `translate(${margin.left} ${margin.top})`);

// scales
// for both the x and y dimensions define linear scales, using the minimum and maximum values defined earlier
const countScale = d3
  .scaleLinear()
  .domain(d3.extent(Object.values(counts)))
  .range([0, width]);

const percentageScale = d3
  .scaleLinear()
  .domain(d3.extent(Object.values(percentages)))
  .range([height, 0]);

// quadrants and labels
// position four rectangles and text elements to divvy up the larger shape in four sections
const quad = [
  'Communist',
  'Nationalist',
  'Socialist',
  'Libertarian',
];

const quadrantsGroup = group
  .append('g')
  .attr('class', 'quadrants');

// include one group for each quadrant
const quadrants = quadrantsGroup
  .selectAll('g.quadrant')
  .data(quad)
  .enter()
  .append('g')
  .attr('class', 'quadrant')
  // position the groups at the four corners of the viz
  .attr('transform', (d, i) => `translate(${i % 2 === 0 ? 0 : width / 2} ${i < 2 ? 0 : height / 2})`);

// for each quadrant add a rectangle and a label
quadrants
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', width / 2)
  .attr('height', height / 2)
  // include a darker shade for the third quadrant
  .attr('fill', (d, i) => (i === 2 ? 'hsl(0, 0%, 0%)' : 'hsl(0, 100%, 100%)'))
  // highlight the second and third quadrant with less transparency
  .attr('opacity', (d, i) => ((i === 1 || i === 2) ? 0.15 : 0.05));

quadrants
  .append('text')
  .attr('x', width / 4)
  .attr('y', height / 4)
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'middle')
  .text(d => d)
  .style('text-transform', 'uppercase')
  .style('font-weight', '300')
  .style('font-size', '0.9rem')
  .attr('opacity', 0.9);

// legend
// include the categories in the bottom right corner of the viz
const legendGroup = group
  .append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${countScale(8500)} ${percentageScale(16)})`);


// axes
const countAxis = d3
  .axisBottom(countScale)
  .tickFormat(d => `${d}%`);

const percentageAxis = d3
  .axisLeft(percentageScale)
  .tickFormat(d => `${d}%`);

// add classes to later identify the axes individually and jointly
group
  .append('g')
  .attr('transform', `translate(0 ${height})`)
  .attr('class', 'axis axis-count')
  .call(countAxis);

group
  .append('g')
  .attr('class', 'axis axis-percentage')
  .call(percentageAxis);

// remove the path describing the axes
d3
  .selectAll('.axis')
  .select('path')
  .remove();

// style the ticks to be shorter
d3
  .select('.axis-count')
  .selectAll('line')
  .attr('y2', 5);

d3
  .select('.axis-percentage')
  .selectAll('line')
  .attr('x2', -4);

d3
  .selectAll('.axis')
  .selectAll('text')
  .attr('font-size', '0.55rem');

// grid
// include dotted lines for each tick and for both axes
d3
  .select('.axis-count')
  .selectAll('g.tick')
  .append('path')
  .attr('d', `M 0 0 v -${height}`)
  .attr('stroke', 'currentColor')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2')
  .attr('opacity', 0.3);

d3
  .select('.axis-percentage')
  .selectAll('g.tick')
  .append('path')
  .attr('d', `M 0 0 h ${width}`)
  .attr('stroke', 'currentColor')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2')
  .attr('opacity', 0.3);


// labels
// add a group to position the label where needed
// for the percentage label, this allows to also modify the transform-origin as to rotate the label from the center of the axis
d3
  .select('.axis-count')
  .append('g')
  .attr('class', 'label label-count')
  .attr('transform', `translate(${width / 2} ${margin.bottom})`);

d3
  .select('g.label-count')
  .append('text')
  .attr('x', 0)
  .attr('y', 0)
  .text('Economy')
  .attr('text-anchor', 'middle');

d3
  .select('.axis-percentage')
  .append('g')
  .attr('class', 'label label-percentage')
  .attr('transform', `translate(-${margin.left} ${height / 2})`);

d3
  .select('g.label-percentage')
  .append('text')
  .attr('x', 0)
  .attr('y', 0)
  .text('Individual Freedom')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'hanging')
  .attr('transform', 'rotate(-90)');

// style both labels with a heavier weight
d3
  .selectAll('g.label text')
  .style('font-size', '0.65rem')
  .style('font-weight', '600')
  .style('letter-spacing', '0.05rem');


// data points
// add a group for each data point, to group circle and text elements
const dataGroup = group
  .append('g')
  .attr('class', 'data');

const dataPointsGroup = dataGroup
  .selectAll('g.data-point')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'data-point')
  .attr('transform', ({count, percentage}) => `translate(${countScale(count)} ${percentageScale(percentage)})`);

// circles using the defined color
dataPointsGroup
  .append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 7.5)
  .attr('fill', ({color}) => color);

// labels describing the circle elements
dataPointsGroup
  .append('text')
  .attr('x', 15)
  .attr('y', 0)
  .attr('class', 'name')
  .text(({name}, i) => `${name}`)
  .attr('dominant-baseline', 'central')
  .style('font-size', '0.6rem')
  .style('font-weight', 'bold')
  .style('letter-spacing', '0.05rem')
  .style('pointer-events', 'none');


// on hover highlight the data point
dataPointsGroup
  .on('mouseenter', function(d) {
    // slightly translate the text to the left and change the fill color
    const text = d3
      .select(this)
      .select('text.name')

    text
      .transition()
      .attr('transform', 'translate(12 0)')
      .style('color', 'hsl(230, 29%, 19%)')
      .style('text-shadow', 'none');

    /* as the first child of the group add another group in which to gather the elements making up the tooltip
    - rectangle faking the text's background
    - circle highlighting the selected data point
    - path elements connecting the circle to the values on the axes
    - rectangles faking the background for the labels on the axes
    - text elements making up the labels on the axes
    */
    const tooltip = d3
      .select(this)
      .insert('g', ':first-child')
      .attr('class', 'tooltip')
      .attr('opacity', 0)
      .style('pointer-events', 'none');


    // for the rectangle retrieve the width and height of the text elements to have the rectangle match in size
    const textElement = text['_groups'][0][0];
    const { x, y, width: textWidth, height: textHeight } = textElement.getBBox();

    tooltip
      .append('rect')
      .attr('x', x - 3)
      .attr('y', y - 1.5)
      .attr('width', textWidth + 6)
      .attr('height', textHeight + 3)
      .attr('fill', 'hsl(227, 9%, 81%)')
      .attr('rx', '2')
      .transition()
      // transition the rectangle to match the text translation
      .attr('transform', 'translate(12 0)');


    // include the two dotted lines in a group to centralize their common properties
    const dashedLines = tooltip
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', 'hsl(227, 9%, 81%)')
      .attr('stroke-width', 2)
      // have the animation move the path with a stroke-dashoffset considering the cumulative value of a dash and an empty space
      .attr('stroke-dasharray', '7 4')
      // animate the path elements to perennially move toward the axes
      .style('animation', 'dashOffset 1.5s linear infinite');


    dashedLines
      .append('path')
      .attr('d', ({percentage}) => `M 0 0 v ${percentageScale(percentages.max - percentage)}`);

    dashedLines
      .append('path')
      .attr('d', ({count}) => `M 0 0 h -${countScale(count)}`);

    // include two labels centered on the axes, highlighting the matching values
    const labels = tooltip
      .append('g')
      .attr('font-size', '0.6rem')
      .attr('fill', 'hsl(227, 9%, 81%)');

    const labelCount = labels
      .append('g')
      .attr('transform', ({percentage}) => `translate(0 ${percentageScale(percentages.max - percentage)})`);

    const textCount = labelCount
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('color', 'hsl(230, 29%, 19%)')
      .text(({count}) => count);

    const labelPercentage = labels
      .append('g')
      .attr('transform', ({count}) => `translate(-${countScale(count)} 0)`);

    const textPercentage = labelPercentage
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('color', 'hsl(230, 29%, 19%)')
      .text(({percentage})=> `${percentage}%`);

    // behind the labels include two rectangles, replicating the faux background specified for the original text element
    const { width: countWidth, height: countHeight } = textCount['_groups'][0][0].getBBox();
    const { width: percentageWidth, height: percentageHeight } = textPercentage['_groups'][0][0].getBBox();

    labelCount
      .insert('rect', ':first-child')
      .attr('x', -countWidth / 2 - 4)
      .attr('y', -countHeight / 2 - 2)
      .attr('width', countWidth + 8)
      .attr('height', countHeight + 4)
      .attr('rx', 3);

    labelPercentage
      .insert('rect', ':first-child')
      .attr('x', -percentageWidth / 2 - 4)
      .attr('y', -percentageHeight / 2 - 2)
      .attr('width', percentageWidth + 8)
      .attr('height', percentageHeight + 4)
      .attr('rx', 3);


    // detail a circle, with a darker fill and a larger radius
    tooltip
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', 'hsl(0, 0%, 0%)')
      .attr('stroke', 'hsl(227, 9%, 81%)')
      .attr('stroke-width', 2)
      .attr('r', 0)
      // transition the circle its full radius
      .transition()
      .attr('r', 9.5);

    // transition the tooltip to be fully opaque
    tooltip
      .transition()
      .attr('opacity', 1);

  })
  // when exiting the hover state reset the appearance of the data point and remove the tooltip
  .on('mouseout', function(d) {
    d3
      .select(this)
      .select('text.name')
      .transition()
      .delay(100)
      .attr('transform', 'translate(0 0)')
      .style('color', 'inherit')
      .style('text-shadow', 'inherit');

    // remove the tooltip after rendering it fully transparent
    d3
      .select(this)
      .select('g.tooltip')
      .transition()
      .attr('opacity', 0)
      .remove();
  });
