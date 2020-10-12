class TicksList {
    constructor(params = {MIN_TICKS_L: 10}) {
        this.params = params;
        this.reset();
    }

    getType() {
        return this.valueCount >= this.params.MIN_TICKS_L ? 'L' : 'S';
    }

    appendPattern() {
        this.pattern += this.typeCount ? `${this.typeCount}${this.prevType}` : '';
    }

    push(value) {
        if (value) {
            this.falseCount = 0;
            this.valueCount++;
        } else {
            this.falseCount++;
            if (this.prevValue === !!value) {
                return;
            }
            if (!this.prevType) {
                this.prevType = this.getType();
            }
            if (this.getType() === this.prevType) {
                this.typeCount++;
            } else {
                this.appendPattern();
                this.prevType = this.getType();
                this.typeCount = 1;
            }
            this.valueCount = 0;
        }
        this.prevValue = !!value;
    }

    flush() {
        if (this.prevValue) this.push(false);
        this.appendPattern();
    }

    pushAll(vals = []) {
       vals.forEach(this.push.bind(this));
       this.flush();
    }

    reset() {
        this.valueCount = 0;
        this.typeCount = 0;
        this.falseCount = 0;
        this.prevType = null;
        this.prevValue = false;
        this.pattern = '';
    }
}

module.exports.ticksList = new TicksList();
module.exports.TicksList = TicksList;
