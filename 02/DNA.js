const random = require('./random');

class DNA {
    constructor(length, dna = null) {
        // Main
        this.length = length;
        this.genes = dna ? dna.genes : this.getRandomGenes(this.length);
        
        // Additional
        this.fitness = 0;
    }

    getRandomGenes(length) {
        return  new Array(length)
            .fill(0)
                .map(() => random.getRandomInt(32, 128));
    }

    updateLength(length) {
        if (length <= this.genes) {
            throw 'Error';
        }

        this.genes = [...this.genes, this.getRandomGenes(length - this.genes.length)];
    }
}

module.exports = DNA;