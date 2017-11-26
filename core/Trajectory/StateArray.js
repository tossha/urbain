class TrajectoryStateArray extends TrajectoryAbstract
{
    constructor(starSystem, referenceFrameId, color) {
        super(starSystem, referenceFrameId);

        this.states = []; // array of {epoch: epoch, state: class StateVector}
        this.minEpoch = null;
        this.maxEpoch = null;
        this.color = color;

        if (color) {
            this.visualModel = new VisualTrajectoryModelStateArray(this, color);
        }
    }

    addState(epoch, state) {
        this.states.push({
            epoch: epoch,
            state: state
        });

        if ((this.minEpoch === null)
            || (epoch < this.minEpoch)
        ) {
            this.minEpoch = epoch;
        }

        if ((this.maxEpoch === null)
            || (epoch > this.maxEpoch)
        ) {
            this.maxEpoch = epoch;
        }
    }

    getStateInOwnFrameByEpoch(epoch) {
        if ((this.minEpoch === null)
            || (this.maxEpoch === null)
            || (epoch < this.minEpoch)
            || (this.maxEpoch < epoch)
        ) {
            return null;
        }

        // Поиск перебором. Потом можно заменить на бинпоиск, но сейчас это неоправданно усложнит код
        for (let i = 1; i < this.states.length; ++i) {
            const next = this.states[i];
            if (next.epoch < epoch) {
                continue;
            }

            const prev = this.states[i - 1];
            // Ускорение -- отношение изменения скорости ко времени, за которое оно произошло
            const acceleration = next.state.velocity.sub(prev.state.velocity).div(next.epoch - prev.epoch);
            const timeDiff = epoch - prev.epoch;
            /* Считаем скорость и положение на данном отрезке по формулам для равноускоренного движения,
             так как на заданном малом промежутке времени движение можно считать равноускоренным:
             v1 = v0 + a * t
             r1 = r0 + (v0 + v1) / 2 * t
             Где v1 -- новый вектор скорости, v0 -- предыдущий вектор скорости,
             a -- вектор ускорения, t -- время, за которое произошло движение,
             r1 -- новый вектор положения, r0 -- предыдущий вектор положения */
            const newVelocity = acceleration.mul(timeDiff).add(prev.state.velocity);
            const newPosition = newVelocity.add(prev.state.velocity).
            mul(timeDiff / 2).add(prev.state.position);
            return new StateVector(
                newPosition,
                newVelocity
            );
        }
    }
}