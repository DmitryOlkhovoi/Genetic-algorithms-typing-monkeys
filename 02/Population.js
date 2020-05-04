const random = require('./random');

class Population {
    constructor(target, dna, n = 100, mutationRate = 0.01, adaptive = false, adaptiveThreshold = 0.6, cutLength = 5) {
        this.endTarget = target; // String
        this.adaptive = adaptive;
        this.adaptiveThreshold = adaptiveThreshold;
        this.cutLength = cutLength;
        this.target = this.adaptive ? target.substr(0, this.cutLength) : target; // String
        this.dna = dna;
        this.n = n;
        this.mutationRate = mutationRate;
        this.population = []
        this.populationInfo = {
            generationCount: 0
        };

        this.initPopulation();
    }

    initPopulation() {
        this.population = new Array(this.n)
            .fill(0)
            .map(() => new this.dna(this.target.length));
        
        this.population.forEach((dna) => dna.fitness = this.evaluateFitness(dna));
    }

    updateDNA(target) {
        this.target = target;

        this.population.forEach((dna) => {
            dna.updateLength(target.length);
        });
    }

    getPopulationInfo() {
        let statsFitness1 = 0;

        return {
            generationCount: this.populationInfo.generationCount,
            averageFitness: this.population
                .reduce((acc, current) => {
                    if (this.target === String.fromCharCode.apply(this, current.genes)) {
                        statsFitness1 += 1;
                    }

                    return acc + current.fitness
                }, 0) / this.population.length,
            statsFitness1
        }
    }

    getMatingPool() {
        let matingPool = [];

        this.population.forEach((dna) => {
            const n = parseInt(dna.fitness * 100);
    
            matingPool = [...matingPool, ...(new Array(n).fill(dna))];
        });

        return matingPool;
    }

    evaluateFitness(dna) {
        return (dna.genes.reduce((acc, current, index) => {
            if (current === this.target.codePointAt(index)) {
                return acc + 1;
            }

            return acc;
        }, 0) / this.target.length);
    }

    findRandomParent(matingPool) {
        return matingPool[random.getRandomInt(0, matingPool.length)];
    }

    nextGeneration() {
        let matingPool = this.getMatingPool();

        this.population.forEach((_, index) => {
            const parentA = this.findRandomParent(matingPool);
            let parentB = null;
            
            while (!parentB || (parentB === parentA)) {
                parentB = this.findRandomParent(matingPool);
            }
    
            let child = this.crossover(parentA, parentB);

            child = this.mutation(child);
            child.fitness = this.evaluateFitness(child)

            this.population[index] = child;
        });

        this.populationInfo.generationCount += 1;

        if (this.adaptive && this.target !== this.endTarget) {
            if (this.getPopulationInfo().averageFitness >= this.adaptiveThreshold) {
                this.updateDNA(this.endTarget.substr(0, this.target.length + this.cutLength));
            }
        }
    }

    crossover(dna1, dna2) {
        const child = new this.dna(this.target.length);

        // Picking a random “midpoint” in the genes array
        const midpoint = random.getRandomInt(0, dna1.genes.length);

        for (let i = 0; i < dna1.genes.length; i++) {
            // Before midpoint copy genes from one parent, after midpoint copy genes from the other parent
            if (i > midpoint) {
                child.genes[i] = dna1.genes[i];
            }
            else {
                child.genes[i] = dna2.genes[i];
            }
        }

        return child;
    }

    mutation(dna) {
        const mutatedDNA = new this.dna(this.target.length, dna);

        // Looking at each gene in the array
        for (let i = 0; i < dna.genes.length; i++) {
            if (random.random() < this.mutationRate) {
                // Mutation, a new random character
                mutatedDNA.genes[i] = random.getRandomInt(32, 128);
            }
        }

        return mutatedDNA;
    }
}

module.exports = Population;