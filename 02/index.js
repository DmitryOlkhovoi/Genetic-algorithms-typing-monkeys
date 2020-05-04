const DNA = require('./DNA');
const Population = require('./Population');
const Log = require('./Log');
const contrib = require('blessed-contrib');

const log = new Log(2, 2);
const statsFitnessAverageIndex = log.addLine([], 'Fitness', 0, 0);
const statsFitness1Index = log.addLine([], 'Fitness 1', 0, 1);
const screenLog = log.grid.set(1, 1, 1, 1, contrib.log, {
    label: 'logs'
});

const TARGET = 'How are you?';
const GENERATIONS = 100;
const POPULATION_NUMBER = 100;
const MUTATION_RATE = 0.01;

const population = new Population(TARGET, DNA, POPULATION_NUMBER, MUTATION_RATE);

const statsFitnessAverage = [];
const statsFitness1 = [];

function main() {
    population.nextGeneration();

    const stats = population.getPopulationInfo();
    statsFitnessAverage.push(stats.averageFitness);
    statsFitness1.push(stats.statsFitness1);
}

function update() {
    log.updateLineData(statsFitnessAverageIndex, statsFitnessAverage);
    log.updateLineData(statsFitness1Index, statsFitness1);
}

function sync() {
    for (let i = 0; i < GENERATIONS; i++) {
        main();
    }

    update();
    
    log.render();
}

function async() {
    setInterval(() => {
        main();
        update();
        log.render();
    }, 10)
}

sync();
screenLog.log(`${population.endTarget} : ${population.target}`)
// async();