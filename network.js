class Network{
    constructor(neuronCounts){
        this.levels=[];
        for (let i = 0; i<neuronCounts.length-1;i++){
            this.levels.push(new Level(neuronCounts[i],neuronCounts[i+1]));
        }
    }

    feedForward(inputs){
        let output = this.levels[0].feedForward(inputs);
        for (let j = 1; j < this.levels.length; j++){
            output = this.levels[1].feedForward(output);
        }
        return output;
    }

    mutate(amount = 1){
        this.levels.forEach(level=>{
            for (let i = 0; i< level.biases.length;i++){
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for (let j = 0; j< level.weights.length;j++){
                for (let i = 0 ; i< level.weights[j].length;i++){
                    level.weights[j][i] = lerp(
                        level.weights[j][i],
                        Math.random()*2-1,
                        amount
                    )
                }
               
            }
        })
    }
}

class Level{
    constructor(inLevels, outLevels){
        this.inLvls=inLevels;
        this.outLvls=outLevels;
        
        this.biases = new Array(this.outLvls);
        this.inputs= new Array(this.inLvls);
        this.outputs = new Array(this.outLvls);

        this.weights = new Array(this.inLvls);
        for (let c = 0; c <this.weights.length;c++){
            this.weights[c] = new Array(this.outLvls);
        }
        this.#randomize();
    }

    #randomize(){
        for (let i = 0; i<this.weights.length;i++){
            for (let j = 0; j < this.outLvls;j++){
                this.weights[i][j]=Math.random()*2-1;
            }
        }
        for (let k =0; k<this.biases.length;k++){
            this.biases[k] = Math.random()*2-1;
        }
    }

    feedForward(inputs){
        this.inputs = inputs;
        for (let j = 0; j < this.outputs.length; j++){
            let sum = 0;
            for (let i = 0; i<this.inputs.length; i++){
                sum += this.inputs[i]*this.weights[i][j];
            }
            if (sum+this.biases[j]>0){
                this.outputs[j]=1;
            }else{
                this.outputs[j]=0;
            }
        }
        return this.outputs;
    }
}