function computer(name, program) {
    this.name = name;
    this.mem = program;
    this.pointer = 0;
    this.output;
    this.relativeBase = 0;

    const operations = [];
    operations[1] = function (a, b) { return a + b; };
    operations[2] = function (a, b) { return a * b; };

    this.prm = [];
    this.nextInstruction = function () {
        const instruction = this.mem[this.pointer].toString();
        const len = instruction.length;
        const opCode = Number(instruction.substr(len - 2));
        this.prm = this.getParameterValues(instruction.substr(0, len - 2), opCode);
        return opCode;
    };

    this.nextPointer = function() {
        this.pointer = Number(this.pointer) + (this.prm.length ? this.prm.length + 1 : 0);
    };

    const INSTRUCTION = {
        ADD: 1,
        MULTIPLY: 2,
        INPUT: 3,
        OUTPUT: 4,
        JUMP_IF_TRUE: 5,
        JUMP_IF_FALSE: 6,
        SET_IF_LESS: 7,
        SET_IF_EQUAL: 8,
        ADJUST_BASE: 9,
        HALT: 99
    };
    const LABELS = ['', 'ADD', 'MUL', 'INP', 'OUT', 'JIT', 'JIF', 'SIL', 'SIE', 'ADJ'];

    this.execute = function* () {
        let running = true;
        while (running) {
            const opCode = this.nextInstruction();
            if (opCode <= LABELS.length) {
                // console.log(`${this.name} pointer ${this.pointer} op ${LABELS[opCode]} prm ${this.prm}`);
            }
            switch (opCode) {
                case INSTRUCTION.ADD:
                case INSTRUCTION.MULTIPLY:
                    this.setRegister(this.prm[2], operations[opCode](this.prm[0], this.prm[1]));
                    this.nextPointer();
                    break;
                case INSTRUCTION.INPUT:
                    let newInput = yield { type: 'INPUT' };
                    this.setRegister(this.prm[0], newInput);
                    this.nextPointer();

                    break;
                case INSTRUCTION.OUTPUT:
                    this.output = this.prm[0];
                    this.nextPointer();
                    yield { type: 'OUTPUT', val: this.output };

                    break;
                case INSTRUCTION.JUMP_IF_TRUE:
                    if (this.prm[0] != 0) {
                        this.pointer = this.prm[1];
                        this.prm = [];
                    }
                    this.nextPointer();
                    break;
                case INSTRUCTION.JUMP_IF_FALSE:
                    if (this.prm[0] == 0) {
                        this.pointer = this.prm[1];
                        this.prm = [];
                    }
                    this.nextPointer();
                    break;
                case INSTRUCTION.SET_IF_LESS:
                    this.setRegister(this.prm[2], Number((this.prm[0] < this.prm[1])));
                    this.nextPointer();
                    break;
                case INSTRUCTION.SET_IF_EQUAL:
                    this.setRegister(this.prm[2], Number((this.prm[0] === this.prm[1])));
                    this.nextPointer();
                    break;
                case INSTRUCTION.ADJUST_BASE:
                    this.relativeBase = this.relativeBase + this.prm[0];
                    this.nextPointer();
                    break;
                case INSTRUCTION.HALT:
                    console.log(`${this.name} completed; output: ${this.output}`);
                    return { type: 'FINAL', val: this.output };
                default:
                    console.log('THIS IS BAD!');
                    return { 
                        type: 'INVALID INDEX',
                        pointer: this.pointer,
                        prm: this.prm,
                        opCode,
                        mem: this.mem
                    };
            }
        }
    };

    const parameterCounts = [-1, 3, 3, 1, 1, 2, 2, 3, 3, 1];
    const outputParameters = [-1, 2, 2, 0, -1, -1, -1, 2, 2, -1];
    this.getParameterValues = function (instr, opCode) {
        const parameters = [];
        if (opCode > parameterCounts.length) {
            return parameters;
        }
        let modeConfig = instr;
        while (modeConfig.length < parameterCounts[opCode]) {
            modeConfig = `0${modeConfig}`;
        }
        const modes = modeConfig.split('').reverse();
        modes.map((mode, idx) => {
            const ptr = this.pointer + idx + 1;
            if (idx === outputParameters[opCode]) {
                const pos = mode === '2' ? this.relativeBase + this.getValue(ptr) : this.getValue(ptr);
                parameters.push(pos);
            } else {
                let addr;
                switch (mode) {
                    case '0': // position
                        addr = this.getValue(ptr);
                        break;
                    case '1': // immediate
                        addr = ptr;
                        break;
                    case '2': // relative position
                        addr = this.relativeBase + this.getValue(ptr);
                        break;
                }
                parameters.push(this.getValue(addr));
            }

            return null;
        });

        if (parameters.find(p => p === undefined) !== undefined) {
            console.log(opCode, modes, parameters);
        }
        return parameters;
    };

    this.getValue = function (addr) {
        let val = this.mem[Number(addr)];
        if (val === undefined) {
            val = this.mem[Number(addr)] = 0;
            // console.log(addr);
        }
        if (isNaN(val) && val.indexOf(',') > - 1) {
            return val;
        }
        return Number(val);
    };

    this.setRegister = function (pointer, value) {
        this.mem[pointer] = value;
    };
}

module.exports = computer;