class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount =5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings=[];

    }

    update(roadBorders,traffic){
        this.#castRays();
        this.readings=[];
        for (let i = 0; i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(this.rays[i],roadBorders,traffic));
        }
    }

    #getReading(ray,roadBorders,traffic){
        let touches = [];
        for (let i =0; i<roadBorders.length;i++){
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if (touch){
                touches.push(touch);
            }
        }
        for (let i=0;i<traffic.length;i++){
            for (let j = 0; j<traffic[i].polygon.length;j++)
            {
                const touch2 = getIntersection(
                    ray[0],
                    ray[1],
                    traffic[i].polygon[j],
                    traffic[i].polygon[(j+1)%traffic[i].polygon.length]
                )
                if (touch2){
                    touches.push(touch2);
                }
            }
        }
        if(touches.length==0){
            return null;
        }
        else{
           const obj = touches.find(e=>e.offset==Math.min(...(touches.map(e=>e.offset))));
           return obj;
        }
    }

    #castRays(){
        this.rays=[]
        for (let i=0; i<this.rayCount;i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?.5:i/(this.rayCount-1)
            ) +this.car.angle;

            const start={x:this.car.x, y:this.car.y};
            const end = {
                x:this.car.x-this.rayLength*Math.sin(rayAngle),
                y:this.car.y-this.rayLength*Math.cos(rayAngle)
            };
            this.rays.push([start,end]);
        }
    }

    draw(ctx){
        for (let i = 0; i<this.rayCount; i++){
            let end = this.rays[i][1];
            if (this.readings[i]){
                end =this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}