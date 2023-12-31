class Road{
    constructor(x,width,laneCount){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;
        this.left=x-width/2;
        this.right=x+width/2;

        const infinity = 1000050;
        this.top = infinity;
        this.bottom = infinity*-1;

        const topLeft={x:this.left,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const topRight={x:this.right,y:this.top};
        const bottomRight={x:this.right,y:this.bottom};

        this.border=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }
    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left+
        (laneWidth/2)+
        Math.min(this.laneCount-1,laneIndex)*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";
        
        for (let i = 1; i<this.laneCount;i++){
            const x = lerp(this.left,this.right,i/this.laneCount);
            ctx.setLineDash([20,20])
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.border.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })
    }

    
}

