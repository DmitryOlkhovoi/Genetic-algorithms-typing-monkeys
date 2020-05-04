function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const TARGET = 'Hey how are you?';
const statsFitnessAverage = [];

class DNA {
    constructor() {
        this.genes = new Array(TARGET.length)
            .fill(0)
                .map(() => getRandomInt(32, 128));
    }

    fitness() {
        this.fitnessScore = (this.genes.reduce((acc, current, index) => {
            if (current === TARGET.codePointAt(index)) {
                return acc + 1;
            }

            return acc;
        }, 0) / TARGET.length);
    }

    crossover(partner, method = false) {
        // The child is a new instance of DNA.
        // Note that the DNA is generated randomly in the constructor,
        // but we will overwrite it below with DNA from parents.
        const child = new DNA();

        if (method) {
            const percent = 0.5;

            for (let i = 0; i < this.genes.length; i++) {
                if (Math.random() >= percent) {
                    child.genes[i] = this.genes[i];
                }
                else {
                    child.genes[i] = partner.genes[i];
                }
            }
        } else {
            // Picking a random “midpoint” in the genes array
            const midpoint = getRandomInt(0, this.genes.length);

            for (let i = 0; i < this.genes.length; i++) {
                //[full] Before midpoint copy genes from one parent, after midpoint copy genes from the other parent
                if (i > midpoint) {
                    child.genes[i] = this.genes[i];
                }
                else {
                    child.genes[i] = partner.genes[i];
                }
                //[end]
            }
        }
        // Return the new child DNA
        return child;
    }

    mutate() {
        const mutationRate = 0.01;
        // Looking at each gene in the array
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < mutationRate) {
            // Mutation, a new random character
            this.genes[i] = getRandomInt(32, 128);
        }
      }
    }
}

// Create population
const population = new Array(100)
    .fill(0)
    .map(() => new DNA());

function evolution() {
    // Mating pool

    let matingPool = [];

    population.forEach((dna) => {
        const n = parseInt(dna.fitnessScore * 100);

        matingPool = [...matingPool, ...(new Array(n).fill(dna))];
    });

    population.forEach((_, index) => {
        // Choose two parents
        const parentA = matingPool[getRandomInt(0, matingPool.length)];
        let parentB = matingPool[getRandomInt(0, matingPool.length)];

        while (parentB === parentA) {
            parentB = matingPool[getRandomInt(0, matingPool.length)];
        }

        // Crossover
        const child = parentA.crossover(parentB, true);

        // Mutate
        child.mutate();

        // Update
        population[index] = child;
    });
}

// Update fitness for default pop
population.forEach((dna) => dna.fitness());

// Evolutions
for (let i = 0; i < 10000; i++) {
    evolution();
    
    // Update fitness 
    population.forEach((dna) => dna.fitness());
     
    statsFitnessAverage.push(
        population.reduce((acc, current) => acc + current.fitnessScore, 0) / population.length
    );
}

var blessed = require('blessed')
, contrib = require('blessed-contrib')
, screen = blessed.screen()
, line = contrib.line(
    { style:
      { line: "yellow"
      , text: "green"
      , baseline: "black"}
    , xLabelPadding: 3
    , xPadding: 5
    , label: 'Fitness'})
, data = {
    x: statsFitnessAverage,
    y: statsFitnessAverage.map(v => v * 100)
}

screen.append(line); //must append before setting data
line.setData([data]);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

screen.render()

// console.log(asciichart.plot(statsFitnessAverage))
// population.forEach(p => console.log(String.fromCharCode.apply(this, p.genes)));