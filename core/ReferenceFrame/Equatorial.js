class ReferenceFrameEquatorial extends ReferenceFrameInertialAbstract
{
    getQuaternionByEpoch(epoch) {
        const z = BODIES[this.origin].orientation.getQuaternionByEpoch(epoch).rotate_(new Vector([0, 0, 1]));
        const equinox = z.cross(new Vector([0, 0, 1]));
        return Quaternion.transfer(new Vector([0, 0, 1]), z).mul(
            Quaternion.transfer(new Vector([1, 0, 0]), equinox)
        );
    }
}