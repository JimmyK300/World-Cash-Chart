function fetchData() {
  var country = [];
  var curr = [];
  var rank = [];
  var btc = [];
  var sat = [];
  var tot = [];

  return fetch('dataforgraph.txt')
    .then(response => response.text())
    .then(data => {
      data = data.trim().split(/\r?\n/);
      for (let i = 0; i < data.length; i++) {
        const line = data[i].split(' ');
        rank.push(Number(line[0]));
        country.push(line[1]);
        btc.push(Number(line[2]));
        sat.push(Number(line[3]));
        tot.push(Number(line[4]));
        curr.push(line[5]);
      }

      return { rank, country, btc, sat, tot, curr };
    })
    .catch(error => {
      console.error(error);
      return null;
    });
}
base = 0;
theHeight = document.body.clientHeight; 
theWidth = document.body.clientWidth;
maxRadius = 0;
if (theHeight >= theWidth){maxRadius=theWidth*0.6}else{maxRadius=theHeight*0.6}
fetchData().then(data => {
  base = data.btc[0];
  for (let i = 0; i < data.rank.length; i++) {  
    createBubble(getRadius(data.btc[i]), data.country[i], data.rank[i]);
    createInfo(data.rank[i], data.country[i], data.btc[i], data.tot[i]);
  }
  // gravity(1, 2);
});
function getRadius(num){
  ratio = Math.sqrt(num)/Math.sqrt(base)
  return ratio*maxRadius
}

function createBubble(radius, name, rank) {
  var bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.id = rank
  bubble.style.fontSize = radius/4 + "px";
  bubble.style.background = "rgba(" + Math.round(Math.random()*255)+ "," + Math.round(Math.random()*255) + "," + Math.round(Math.random()*255) + ", 0.7)"
  bubble.textContent = name;
  // bubble.line= radius + "px";
  bubble.style.lineHeight = radius + 'px'; 
  bubble.style.width = radius + "px";
  bubble.style.height = radius + "px";
  position = RandomizeSpawn(radius);
  bubble.style.top = position[1] + "%";
  bubble.style.left = position[0] + "%";
  document.body.appendChild(bubble);
  // bubble.addEventListener("mouseover", function(){showinfo(rank)});
  // bubble.addEventListener("mouseout", function(){hideinfo(rank)});
  bubble.addEventListener("mousemove", function(){moveinfo(rank)});
  bubble.addEventListener("mouseout", function(){removeinfo(rank)})
}

function createInfo(rank, country, btc, tot,){
  var info = document.createElement("div")
  var mydiv = document.getElementById('demo')
  info.className = "hiddenUntilHover";
  info.id = rank + 'info';
  info.innerHTML = "Rank: " + rank + "<br>" + "Country: " + country + "<br>" + "BTC: " + btc + "<br>" + "Total: " + tot;
  document.body.appendChild(info);
}

moveinfo = function(rank){
  var info = document.getElementById(rank + 'info');
  info.style.left = event.clientX + 15 + "px";
  info.style.top = event.clientY + "px";
  info.style.display = "block";
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
  percentx = Math.random()*(possiblex/bodywidth*100) + (1-possiblex/bodywidth)*50;
  percenty = Math.random()*(possibley/bodyheight*percent*100) + (1-possibley/bodyheight)*50 + 100-percent*100;
  return [percentx, percenty];
  
}
topDivider = 10
function hide(){  
  const elements = [];
  var change = document.getElementById("hide");
  var tick;
  if (change.textContent == 'Hide top ' + topDivider) {tick = true;} else {tick = false;}
  if (tick == true){
    for (let i = 1; i <= topDivider; i++) {
      const element = document.getElementById(i.toString());
      if (element) {
        element.style.width = 0 + "px";
        element.style.height = 0 + "px";
        element.style.fontSize = 0 + "px";
        element.style.display = "none";
        elements.push(element);
        
      }
    }
    change.textContent = "Show top " + topDivider;
    shufflerest();
  }else{
    for (let i = 1; i <= topDivider; i++) {
      const element = document.getElementById(i.toString());
      if (element) {
        element.style.display = "block";
        elements.push(element);
        
      }
    }
    change.textContent = "Hide top " + topDivider;
    reshufflerest();
  }
}

function shuffle(){
  var bubbles = document.getElementsByClassName("bubble");
  position = [];
  for (i = 0; i < bubbles.length; i++){
    const bubble = bubbles[i];
    radius = bubble.clientHeight/2
    position = RandomizeSpawn(radius);
    bubble.style.top = position[1] + "%";
    bubble.style.left = position[0] + "%";
  }
}
function shufflerest() {
  var bubbles = document.getElementsByClassName("bubble");
  position = [];
  fetchData().then(data => {
    base = data.btc[topDivider];
    for (i =topDivider; i < bubbles.length; i++){
      const bubble = bubbles[i];
      radius = getRadius(data.btc[i]);
      multiplier = 0.6
      realRadius = radius*multiplier
      bubble.style.lineHeight = realRadius + 'px'; 
      bubble.style.width = realRadius + "px";
      bubble.style.height = realRadius + "px";
      position = RandomizeSpawn(realRadius);
      bubble.style.top = position[1] + "%";
      bubble.style.left = position[0] + "%";
      bubble.style.fontSize = realRadius/4 + 'px';
    }
  });
}
function reshufflerest(){
  var bubbles = document.getElementsByClassName("bubble");
  position = [];
  fetchData().then(data => {
    base = data.btc[0];
    for (i = 0; i < bubbles.length; i++){
      const bubble = bubbles[i];
      radius = getRadius(data.btc[i]);
      bubble.style.lineHeight = radius + 'px'; 
      bubble.style.width = radius + "px";
      bubble.style.height = radius + "px";
      position = RandomizeSpawn(radius);
      bubble.style.top = position[1] + "%";
      bubble.style.left = position[0] + "%";
      bubble.style.fontSize = radius/4 + 'px';
    }
  });
}