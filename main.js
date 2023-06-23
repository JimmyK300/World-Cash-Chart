data2 = {};
function fetchData() {
  var country = [];
  var curr = [];
  var rank = [];
  var btc = [];
  var sat = [];
  var tot = [];

  return fetch('data.txt')
    .then(response => response.text())
    .then(data => {
      data = data.trim().split(/\r?\n/);
      for (let i = 0; i < data.length; i++) {
        const line = data[i].split(',');
        rank.push(Number(line[0]));
        curr.push(line[1]);
        btc.push(Number(line[2]));
        sat.push(Number(line[3]));
        tot.push(Number(line[4]));
        country.push(line[5]);
      }
      
      return { rank, curr, btc, sat, tot, country };
    })
    .catch(error => {
      console.error(error);
      return null;
    });
}
function getBase(){
  return data2.btc[topDivider];
}
base = 0;
topDivider = 0;
theHeight = document.body.clientHeight; 
theWidth = document.body.clientWidth;
maxRadius = 0;
bubblePositions = [];
if (theHeight >= theWidth){maxRadius=theWidth*0.4}else{maxRadius=theHeight*0.4}
fetchData().then(data => {
  data2 = data;
  base = data.btc[topDivider];
  //console.log(base);
  position = RandomizeSpawn(getRadius(data.btc[topDivider]));
  createBubble(getRadius(data.btc[topDivider]), data.curr[topDivider], data.rank[topDivider] , position[0], position[1]);
  createInfo(data.rank[topDivider], data.country[topDivider], data.btc[topDivider], data.tot[topDivider]);
  bubblePositions.push([position[0], position[1]])
  for (let i = topDivider+1; i < data.rank.length; i++) {  
    getNonOverlappingPosition(i, data);  
    createBubble(getRadius(data.btc[i]), data.curr[i], data.rank[i], bubblePositions[i][0], bubblePositions[i][1]);
    createInfo(data.rank[i], data.country[i], data.btc[i], data.tot[i]);
  }
  //console.log(bubblePositions);
  bubblePositions = [];
});

function getRadius(num){
  base = getBase();
  ratio = Math.sqrt(num)/Math.sqrt(base);
  //console.log(ratio + "  " + base + "  " + num);
  return ratio*maxRadius/2
}

function createBubble(radius, name, rank , x, y) {
  var bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.id = rank
  bubble.style.fontSize = radius/2 + "px";
  bubble.style.background = "rgba(" + Math.round(Math.random()*255)+ "," + Math.round(Math.random()*255) + "," + Math.round(Math.random()*255) + ", 0.7)"
  bubble.textContent = name;
  // bubble.line= radius + "px";
  bubble.style.lineHeight = radius*2 + 'px'; 
  bubble.style.width = radius*2 + "px";
  bubble.style.height = radius*2 + "px";
  bubble.style.top = x + "px";
  bubble.style.left = y + "px";
  document.body.appendChild(bubble);
  // bubble.addEventListener("mouseover", function(){showinfo(rank)});
  // bubble.addEventListener("mouseout", function(){hideinfo(rank)});
  bubble.addEventListener("mousemove", function(){moveinfo(rank)});
  bubble.addEventListener("mouseout", function(){removeinfo(rank)});
}

function createInfo(rank, country, btc, tot,){
  var info = document.createElement("div");
  var mydiv = document.getElementById('demo');
  info.className = "hiddenUntilHover";
  info.id = rank + 'info';
  info.innerHTML = "Rank: " + rank + "<br>" + "Currency: " + country + "<br>" + "Total: " + getSmallerNumber(tot) + "<br>" +  "BTC: " + getSmallerNumber(btc);
  document.body.appendChild(info);
}

function getSmallerNumber(num){
  if (num >= 1000000000000000){
    return formatNumber((num/1000000000000000))+ "Quadrillion";
  } else if (num >= 1000000000000){
  return formatNumber((num/1000000000000)) + "T";
  } else if (num >= 1000000000){
    return formatNumber((num/1000000000)) + "B";
  } else if (num >= 1000000){
    return formatNumber((num/1000000)) + "M";
  }else{
    return num;
  }
}

function formatNumber(num) {
  let roundedNum = parseFloat(num.toFixed(2)).toString().replace(/(\.[0-9]*?)0+$/, "$1");
  if (roundedNum.endsWith(".")) {
    roundedNum = roundedNum.slice(0, -1);
  }
  return roundedNum;
}

moveinfo = function(rank){
  var info = document.getElementById(rank + 'info');
  info.style.left = event.clientX + 15 + "px";
  info.style.display = "block";
  info.style.top = event.clientY + "px";
  if ((info.clientWidth + event.clientX) > theWidth*0.95){
    info.style.left = event.clientX - info.clientWidth - 15 + "px";
  }
  if ((info.clientHeight + event.clientY) > theHeight*0.93){
    info.style.top = event.clientY - info.clientHeight - 10 + "px";
  }
}

removeinfo = function(rank){
  var info = document.getElementById(rank + 'info');
  info.style.left = -9999 +  + "px";
  info.style.top = -9999 + "px";
  info.style.display = "none";
}

function RandomizeSpawn(z){
  var body = document.body;
  var bodywidth = body.clientWidth;
  var bodyheight = body.clientHeight;
  var top = 80.667/bodyheight*100;
  var possiblex = bodywidth - (2*z); 
  var possibley = bodyheight - (2*z);
  percent = 1;
  if (possiblex <= 2*z && possiblex >= z) {
    bodywidth = bodywidth - z;
  }
  if (bodywidth < z) {
    possiblex = bodyheight/2;
  }
  if (bodyheight*percent <= 2*z && bodyheight*percent >= z) {
    possibley = bodyheight - z;
  }
  if (bodyheight*percent < z) {
    possibley = bodyheight/2;
  }
  percentx = Math.random()*(possiblex/bodywidth*99) + (1-possiblex/bodywidth)*50;
  percenty = Math.random()*(possibley/bodyheight*percent*97) + (1-possibley/bodyheight)*50 + 100-percent*100;
  return [percenty*theHeight/100,percentx*theWidth/100];
  
}
function hide(){  
  const elements = [];
  var change = document.getElementById("hide");
  var tick;
  if (change.textContent == 'Hide top ' + 10) {tick = true;} else {tick = false;}
  if (tick == true){
    topDivider = 10;
    for (let i = 1; i <= 10; i++) {
      const element = document.getElementById(i.toString());
      if (element) {
        element.style.width = 0 + "px";
        element.style.height = 0 + "px";
        element.style.fontSize = 0 + "px";
        element.style.display = "none";
        elements.push(element);
        
      }
    }
    hidePart2(data2);
    reshuffle(data2);
    change.textContent = "Show top " + 10;
  }else{
    topDivider = 0;
    for (let i = 1; i <= 10; i++) {
      const element = document.getElementById(i.toString());
      if (element) {
        element.style.display = "block";
        elements.push(element);
        
      }
    }
    hidePart2(data2);
    change.textContent = "Hide top " + 10;
  }
}

// function shuffle(){
//   var bubbles = document.getElementsByClassName("bubble");
//   position = [];
//   for (i = 0; i < bubbles.length; i++){
//     const bubble = bubbles[i];
//     radius = bubble.clientHeight/2
//     position = RandomizeSpawn(radius);
//     bubble.style.top = position[1] + "%";
//     bubble.style.left = position[0] + "%";
//   }
// }
// function shufflerest() {
//   var bubbles = document.getElementsByClassName("bubble");
//   position = [];
//   fetchData().then(data => {
//     base = data.btc[topDivider];
//     for (i =topDivider; i < bubbles.length; i++){
//       const bubble = bubbles[i];
//       radius = getRadius(data.btc[i]);
//       multiplier = 0.6
//       realRadius = radius*multiplier
//       bubble.style.lineHeight = realRadius + 'px'; 
//       bubble.style.width = realRadius + "px";
//       bubble.style.height = realRadius + "px";
//       position = RandomizeSpawn(realRadius);
//       bubble.style.top = position[1] + "%";
//       bubble.style.left = position[0] + "%";
//       bubble.style.fontSize = realRadius/4 + 'px';
//     }
//   });
// }
// function reshufflerest(){
//   var bubbles = document.getElementsByClassName("bubble");
//   position = [];
//   fetchData().then(data => {
//     base = data.btc[0];
//     for (i = 0; i < bubbles.length; i++){
//       const bubble = bubbles[i];
//       radius = getRadius(data.btc[i]);
//       bubble.style.lineHeight = radius + 'px'; 
//       bubble.style.width = radius + "px";
//       bubble.style.height = radius + "px";
//       position = RandomizeSpawn(radius);
//       bubble.style.top = position[1] + "%";
//       bubble.style.left = position[0] + "%";
//       bubble.style.fontSize = radius/4 + 'px';
//     }
//   });
// }

function getNonOverlappingPosition(i, data){
  var currentDistant = 0;
  var currentTotalRadius = 0;
  position = RandomizeSpawn(getRadius(data.btc[i+topDivider]));
  flagNewPosition = false;
  let j = topDivider;
  // console.log('radius of ' + (i+topDivider) + "   " + getRadius(data.btc[i+topDivider]));
  while (j < i) { // make sure that the position is not overlapping with existing bubbles
      currentDistant = GetDistance(position[0], position[1], bubblePositions[j][0], bubblePositions[j][1])
      currentTotalRadius = getRadius(data.btc[i+topDivider]) + getRadius(data.btc[j])
      //console.log(currentDistant + '  first position of ' + i + " over " + j + ": " + currentTotalRadius)
      while (currentDistant < currentTotalRadius){
          //console.log(currentDistant + '  overlapped ' + i + " over " + j  + ": " + currentTotalRadius)
          position = RandomizeSpawn(getRadius(data.btc[i+topDivider])); //check if the random posistion is overlapping with bubble j
          flagNewPosition = true;
          currentDistant = GetDistance(position[0], position[1], bubblePositions[j][0], bubblePositions[j][1])
          currentTotalRadius = getRadius(data.btc[i+topDivider]) + getRadius(data.btc[j])
          //console.log(currentDistant + '  next postion of ' + i + " over " + j  + ": " + currentTotalRadius)
          break;
      } 
      if (flagNewPosition) {j = topDivider; flagNewPosition = false;}
      else{j++;}
  }
  bubblePositions.push(position);
}

GetDistance = function (x1, y1, x2, y2) {
  let x = Math.abs(x2 - x1);
  let y = Math.abs(y2 - y1);
  //console.log("position of bubble over previous one: " + x+","+y+","+x1+","+y1+","+x2+","+y2)
  return Math.sqrt(x * x + y * y);
}

function reshuffle(data){
  var bubbles = document.getElementsByClassName("bubble");
  radius = getRadius(data.btc[topDivider]);
  position = RandomizeSpawn(radius);
  bubbles[topDivider].style.top = position[0] + "px";
  bubbles[topDivider].style.left = position[1] + "px";
  bubblePositions.push([position[0], position[1]]);
  for (let i = 1; i < data.rank.length; i++) {  
    getNonOverlappingPosition(i, data);  
    bubbles[i].style.top = bubblePositions[i][0] + "px";
    bubbles[i].style.left = bubblePositions[i][1] + "px";
  }
  bubblePositions.length = 0;
}

function hidePart2(data){
  base = data2.btc[topDivider];
  //console.log("base: " + base);
  var bubbles = document.getElementsByClassName("bubble");
  radius = getRadius(data.btc[topDivider]);
  position = RandomizeSpawn(radius);
  bubbles[topDivider].style.top = position[0] + "px";
  bubbles[topDivider].style.left = position[1] + "px";
  bubbles[topDivider].style.lineHeight = radius*2 + 'px'; 
  bubbles[topDivider].style.width = radius*2 + "px";
  bubbles[topDivider].style.height = radius*2 + "px";
  bubbles[topDivider].style.fontSize = radius/2 + "px";
  bubblePositions.push([position[0], position[1]]);
  for (let i = topDivider+1; i < data.rank.length; i++) {  
    getNonOverlappingPosition(i-topDivider, data);
    radius = getRadius(data.btc[i]);  
    bubbles[i].style.top = bubblePositions[i-topDivider][0] + "px";
    bubbles[i].style.left = bubblePositions[i-topDivider][1] + "px";
    bubbles[i].style.lineHeight = radius*2 + 'px'; 
    bubbles[i].style.width = radius*2 + "px";
    bubbles[i].style.height = radius*2 + "px";
    bubbles[i].style.fontSize = radius/2 + "px";
  }
  //console.log(bubblePositions);
  bubblePositions= [];
}
//set base to top divider and just change top didider