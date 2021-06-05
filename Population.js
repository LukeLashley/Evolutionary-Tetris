let mostRecentGeneration = []; // Meant for storing generations for future upgrades.
class Population {
    constructor(mutate, numberOfChildren) {
        this.parentsPool = []; //Parent pool for reproduction.
        this.population = []; //Current population of this generation.
        this.bestChildren = []; //Stores the best child from each generation.
        this.numberOfChildren = numberOfChildren; // The amount of children per generation
        this.mutate = mutate; // The mutation rate
        this.maxFitness = 0; // Stores the max fitness.
        this.bestChild; // Stores the best child
        this.games = []; //Stores the games from each child.
        this.generationNumber = 0; //Counts the amount of generations.
        this.createChildren(this.numberOfChildren);
        // console.log(this.population);

        this.newGen();
    }

    createChildren(num) { // Creates num amount of random children.
        for(let i = 0; i < num; i++) {
            // console.log(i);
            this.population[i] = new Child();
        }
    }

    newGen() { //Creates a new generation.
        // console.log(this.population);
        for(let i = 0; i < this.numberOfChildren; i++) {
            this.population[i].runGame();
            this.games[i] = this.population[i].game;
        }
        console.log(this.generationNumber);
        // console.log(this.population);
        // console.log(this.numberOfChildren);
        this.calcFitness();
        console.log(this.bestChildren);
        mostRecentGeneration = this.population;
        this.pickParents();
        this.breedParents();
    }

    getPopulation() { //Getter for the population. Not needed, but helpful.
        return this.population;
    }
    //Determines the maximum Fitness and saves the child.
    calcFitness() {
        this.maxFitness = 0;
        for(let i = 0; i < this.numberOfChildren; i++) {
            // console.log(this.population[i].fitness());
            if(this.population[i].fitness() > this.maxFitness) {
                this.maxFitness = this.population[i].fitness();
                this.bestChild = this.population[i];
            }
        }
        this.bestChildren[this.generationNumber] = this.bestChild;
    }
    //Adds parents to the parents pool based off of their score, meaning those with a higher score will be much more likely to be picked.
    pickParents() {
        for(let i = 0; i < this.numberOfChildren; i++) {
                for(let j = 0; j < this.population[i].fitness()/10; j++) {
                    this.parentsPool.push(this.population[i]);
                }            
        }
    }

    //Breeds parents by calling crossover. Takes a random amount of elemnts from both parents.
    breedParents() {
        this.parents = [];
        // console.log(this.population);
        for(let i = 0; i < this.population.length; i++) {

            let mom = this.parentsPool[floor(random(0,this.parentsPool.length))];
            let dad = this.parentsPool[floor(random(0,this.parentsPool.length))];    
            let child = mom.crossover(dad);
            child.mutate(this.mutate);
            this.population[i] = child;
        }
        // console.log(this.population);
        this.parentsPool = [];
        this.generationNumber++;
    }
}