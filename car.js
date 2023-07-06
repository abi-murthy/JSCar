class Car{
    constructor(x,y,width,height){
        this.x = x;
        this.y=y;
        this.width = width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.fric=.05;
        this.angle=0;

        this.sensor = new Sensor(this);
        this.controls=new Controls();
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(-this.width/2,-this.height/2, this.width,this.height);
        ctx.fill();
        ctx.restore();
        this.sensor.draw(ctx);
    }
    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
    }

    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.height,this.width)/2;
        const alpha = Math.atan2(this.width,this.height);
        points.push({
            
        })
    }

    #move(){
        if (this.controls.forward){
            this.speed+=this.acceleration;
        }
        if (this.controls.reverse){
            this.speed-=this.acceleration;
        }
        if (this.speed>this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if (this.speed<-this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        if (this.speed){
            this.speed += -Math.sign(this.speed)*this.fric;
        }
        if (Math.abs(this.speed)<this.fric){
            this.speed = 0;
        }
        if (this.controls.left){
            this.angle+=0.03*Math.sign(this.speed);
        }
        if (this.controls.right){
            this.angle-=0.03*Math.sign(this.speed);
        }
        this.y-=Math.cos(this.angle)*this.speed;
        this.x-=Math.sin(this.angle)*this.speed;
    }

}
