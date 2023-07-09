const canvas=document.getElementById("myCanvas");

canvas.width=200;

const NUMCARS = 350;
let MUTATION = .10;

if (sessionStorage.getItem("mutation")){
    MUTATION = Number(sessionStorage.getItem("mutation"));
}
const NUMLANES = 3;

let ticker = -100;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2,canvas.width*.9,NUMLANES);
const cars = generateCars(NUMCARS);
const traffic = [new Car(road.getLaneCenter(0),200,30,50,"DUMMY",2)];


addTraffic(-100);
addTraffic(-300);
addTraffic(-500);
addTraffic(-700);



// addTraffic(-250);
let bestCar = cars[0];
if (sessionStorage.getItem("bestBrain")){
    const bestBrain = JSON.parse(sessionStorage.getItem(
        "bestBrain"
    ));

    if(bestBrain.levels[0].inputs.length==bestCar.sensor.rayCount){
        for (let i = 0; i<bestBrain.levels.length;i++){
            for (let j = 0; j< cars.length;j++){
                cars[j].brain.levels[i].biases = [...bestBrain.levels[i].biases];
                cars[j].brain.levels[i].weights = [...bestBrain.levels[i].weights].map(e=>[...e]);
                if (j){
                    cars[j].brain.mutate(MUTATION);
                }
            }
        }
    }
}



function addTraffic(y,numLanes = road.laneCount){
    let arr = [...Array(numLanes).keys()];
    arr.sort(() => Math.random() - 0.5);
    const lanes = arr.slice(Math.floor(1+Math.random()*(numLanes-1)));
    for (let i = 0; i<lanes.length; i++){
        traffic.push(new Car(road.getLaneCenter(lanes[i]),y,30,50,"DUMMY",2));
    }
}

// function getM(){
//     console.log("gpt");
// }

function mutationChange(sign){
    MUTATION +=.01*sign;
    if (MUTATION>1){
        MUTATION=1;
    }
    if (MUTATION<0){
        MUTATION=0;
    }
    const elem = document.getElementById("m-display");
    elem.innerHTML = MUTATION.toFixed(3);
    sessionStorage.setItem("mutation",MUTATION);
}

function generateCars(N){
    const cars=[];
    for (let i = 0; i< N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50, "AI"));
    }
    return cars;
    
}

function save(){
    sessionStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}


function discard(){
    sessionStorage.removeItem("bestBrain");
    sessionStorage.removeItem("mutation");
    window.location.reload();
}

let displacement = 0;

animate();
function animate(){
    ticker = traffic[0].y-displacement-300;
    if (bestCar.y <ticker){
        displacement +=200;
        addTraffic(ticker-800);
    }
    for (let k = 0; k<traffic.length;k++){
        traffic[k].update(road.border,[]);
    }
    for (let j = 0; j<cars.length;j++){
        cars[j].update(road.border,traffic);
    }
    bestCar = cars.find(y=>(y.y==Math.min(...cars.map(c=>c.y))));

    canvas.height=window.innerHeight;


    ctx.save()
    ctx.translate(0,-bestCar.y+.7*window.innerHeight);
    road.draw(ctx);
    for (let k = 0; k<traffic.length;k++){
        traffic[k].draw(ctx, "red");
    }
    ctx.globalAlpha = .2;
    for (let j = 0; j<cars.length;j++){
        cars[j].draw(ctx, "blue");    
    }  
    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "blue",true); 
    


    ctx.restore();
    const odo = ((-99-bestCar.y+traffic[0].y)/10).toFixed(0)
    document.getElementById("odometer").innerHTML=odo;
    requestAnimationFrame(animate);

    
}