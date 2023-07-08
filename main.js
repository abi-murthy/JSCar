const canvas=document.getElementById("myCanvas");

canvas.width=200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2,canvas.width*.9);
const car = new Car(road.getLaneCenter(1),100,30,50,"AI");
const traffic = [new Car(road.getLaneCenter(1),-125,30,50,"DUMMY",2)];

animate();

function animate(){
    for (let k = 0; k<traffic.length;k++){
        traffic[k].update(road.border,[]);
    }
    car.update(road.border,traffic)
    canvas.height=window.innerHeight;

    ctx.save()
    ctx.translate(0,-car.y+.7*window.innerHeight);
    road.draw(ctx);
    for (let k = 0; k<traffic.length;k++){
        traffic[k].draw(ctx, "red");
    }
    car.draw(ctx, "blue");
    ctx.restore();
    requestAnimationFrame(animate);
}