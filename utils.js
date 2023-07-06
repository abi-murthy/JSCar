function lerp(A,B,c){
    return A + (B-A)*c;
}

function getIntersection(A,B,c,d){
    const tTop = (d.x-c.x)*(A.y-c.y)-(d.y-c.y)*(A.x-c.x);
    const uTop = (c.y-A.y)*(A.x-B.x)-(c.x-A.x)*(A.y-B.y);
    const bot = (d.y-c.y)*(B.x-A.x)-(d.x-c.x)*(B.y-A.y);

    if (bot==0){
        return null;
    }
    const t = tTop/bot;
    const u = uTop/bot;
    if (t>1||t<0||u<0||u>1){
        return null;
    }


    const ret = {
        x:lerp(A.x,B.x,t),
        y:lerp(A.y,B.y,t),
        offset:t
    };
    return ret;
}