class Car{
    constructor(x,y,width,height,cType,maxSpeed = 3){
        this.x = x;
        this.y=y;
        this.width = width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.fric=.05;
        this.angle=0;

        this.damaged = false;

        this.ai = cType=="AI";
        if (cType != "DUMMY")
        {
            this.sensor = new Sensor(this);
            this.brain= new Network([
                this.sensor.rayCount, 7,4
            ]);
        }
        this.controls=new Controls(cType);
        // this.polygon = this.#createPolygon();
    }

    draw(ctx,color, drawSensor = false){
        if (this.damaged){
            ctx.fillStyle="gray";
        }
        else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for (let i = 1; i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        if (this.sensor && drawSensor)
        {this.sensor.draw(ctx);}
    }
    update(roadBorders,traffic){
        if (!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        
        
            if(this.sensor)
            {
                this.sensor.update(roadBorders,traffic);
                const outs = this.brain.feedForward(this.sensor.readings.map(r=>r==null?0:1-r.offset));
                if(this.ai){
                    this.controls.forward=outs[0];
                    this.controls.reverse=outs[1];
                    this.controls.left=outs[2];
                    this.controls.right=outs[3];
                }
            }
        }
    }

    #assessDamage(roadBorders,traffic){
        for (let j = 0; j<roadBorders.length;j++){
            if (polyIntersect(this.polygon, roadBorders[j])){
                return true;
            }
        }
        for (let j = 0; j<traffic.length;j++){
            if (polyIntersect(this.polygon, traffic[j].polygon)){
                return true;
            }
        }
        return false;
    }


    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.height,this.width)/2;
        const alpha = Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad,
            // top right
        })
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad,
            //top left
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad,
            //bottom left
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad,
            //bottom rights
        })
        return points;
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

