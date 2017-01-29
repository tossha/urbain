/**
 * xform.js Linear Algebra Library
 *
 * @author Christopher Grabowski - https://github.com/cgrabowski
 * @license MIT License
 * @version 0.1.0
 *
 * Copyright (c) 2015 Christopher Grabowski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// create the xform namespace for running in a browser environment.
/**
 * All types and functions belong to the xform namespace.
 *
 * @namespace xform
 */
var xform = {};

(function(undefined) {
    'use strict';

    // Set the exports property if this is a CommonJS environment (e.g., node.js).
    if (typeof module !== 'undefined') {
        module.exports = xform;
    }

    /**
     * @property {constructor} Dimensional
     * @property {constructor} Dimensions
     * @property {constructor} Vector
     * @property {constructor} Matrix
     * @property {constructor} Quaternion
     * @property {constructor} Attitude
     * @property {constructor} DimensionError
     */
    xform.Dimensional = Dimensional;
    xform.Dimensions = Dimensions;
    xform.Vector = Vector;
    xform.Matrix = Matrix;
    xform.Quaternion = Quaternion;
    xform.Attitude = Attitude;
    xform.DimensionError = DimensionError;

    /**
     * Checks the dimensions of two objects and throws a DimensionError if they do
     * not match.
     *
     * @throws {DimensionError} if the dimensions of obj1 and obj2 do not match.
     * @param {Array | number} obj1 - The first object (or number) to compare.
     * @param {Array | number} obj2 - The second object (or number) to compare.
     * @returns {void}
     */
    var dimCheck = function(obj1, obj2) {
        if (obj1.dim != null) {
            var dim = obj2.dim || [obj2.length];
            if (!obj1.dim.equals(dim)) {
                throw new DimensionError(obj1, obj2);
            }
        } else if (obj2.dim != null) {
            var dim = obj1.dim || [obj1.length];
            if (!obj2.dim.equals(dim)) {
                throw new DimensionError(obj1, obj2);
            }
        } else if (obj1.length !== obj2.length) {
            throw new DimensionError(obj1, obj2);
        }
    };

    /**
     * Performs a deep comparison of the entries of two Array-like objects.
     *
     * @param {Array} arr1 - The first Array-like object to compare.
     * @param {Array} arr2 - The second Array-like object to compare.
     * @returns {boolean} True if all entries are equal, false otherwise.
     */
    var arrayIndexedEntriesEqual = function(arr1, arr2) {
        var toString = Object.prototype.toString;

        // determine if arr1 and arr2 are array-like
        if (!(arr1 instanceof Array) && !/Array/.test(toString.call(arr1))) {
            return false;
        } else if (!(arr2 instanceof Array) && !/Array/.test(toString.call(arr2))) {
            return false;
        }

        for (var i = 0, len = arr1.length; i < len; ++i) {
            if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
                if (!arrayIndexedEntriesEqual(arr1[i], arr2[i])) {
                    return false;
                }
            } else if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };

    /**
     * Common supertype of all types with dimensions.
     *
     * @name Dimensional
     * @constructor
     * @extends Array
     * @param {Array | number} dimensionality - An array whose entries represent an index and
     * whose value is the dimensionality of that index -or- a number that
     * represents the dimensionality.
     * @example
     * // Creates a Dimensional with a 3-dimensional index and a 4-dimensional
     * // index, just like a 3x4 Matrix.
     * new Dimensional([3, 4]);
     */
    function Dimensional(dimensionality) {
        dimensionality = dimensionality || null;
        if (typeof dimensionality === 'number') {
            this.dim = new Dimensions([dimensionality]);
        } else if (dimensionality instanceof Array) {
            this.dim = new Dimensions(dimensionality);
        } else {
            var msg = "Dimensional constructor expected number or array but got ";
            var type = (dimensionality === null) ? 'null' : dimensionality.constructor;
            throw new TypeError(msg + type);
        }
    }

    Dimensional.prototype = Object.create(Array.prototype);
    Dimensional.prototype.constructor = Dimensional;

    /**
     * @name equals
     * @memberof Dimensional.prototype
     * @function
     * @param {Array} array - The array to compare this Dimensional to.
     * @returns {boolean} True if all entries are equal, false otherwise.
     */
    Dimensional.prototype.equals = function(array) {
        if (array instanceof Dimensional) {
            if (this.dim.equals(array.dim) && arrayIndexedEntriesEqual(this, array)) {
                return true;
            } else {
                return false;
            }
        } else if (array instanceof Array) {
            if (arrayIndexedEntriesEqual(this, array)) {
                return true;
            } else {
                return false;
            }
        } else {
            var type;
            var ctorName = this.constructor.name;
            if (typeof array === 'number') {
                type = 'number';
            } else {
                type = array.constructor.name;
            }
            throw new TypeError(ctorName + '.prototype.equals expected instanceof Array but got ' + type);
        }
    };

    /**
     * Represents the dimensionality of a type.
     *
     * @name Dimensions
     * @class
     * @extends Array
     * @param {Array | number} arrayOrNumber- Array whose entries represent the number
     * of dimensions of each index -or- for convenience, a number that represents the dimensions of
     * an object with one index
     */
    function Dimensions(arrayOrNumber) {
        arrayOrNumber = arrayOrNumber || null;
        if (typeof arrayOrNumber === 'number') {
            this.push(arrayOrNumber);
        } else if (arrayOrNumber instanceof Array) {
            for (var i = 0, len = arrayOrNumber.length; i < len; ++i) {
                this.push(arrayOrNumber[i]);
            }
        } else {
            var msg = 'Dimensions constructor expected number or array but got ';
            var type = (arrayOrNumber === null) ? 'null' : arrayOrNumber.constructor;
            throw new TypeError(msg + type);
        }
    }
    Dimensions.prototype = Object.create(Array.prototype);
    Dimensions.prototype.constructor = Dimensions;

    Dimensions.copy = function(dim, out) {
        if (out == null) {
            out = new Dimensions(dim);
        } else {
            var len = dim.length;
            out.length = len;
            for (var i = 0; i < len; ++i) {
                out[i] = dim[i];
            }
        }
        return out;
    };

    /**
     * @name equals
     * @memberof Dimensions.prototype
     * @function
     * @param {Dimensions} dimensions - The Dimensions to compare this Dimensions to.
     * @returns {boolean} True if the Dimensions are equal, false otherwise.
     *
     */
    Dimensions.prototype.equals = function(dimensions) {
        return arrayIndexedEntriesEqual(this, dimensions);
    };

    /**
     * @name set
     * @memberof Dimensions.prototype
     * @function
     * @param {Array} array - The array whose entries will be set in this Dimensional.
     * @returns {Dimensions} This Dimensions.
     */
    Dimensions.prototype.set = function(array) {
        this.length = array.length;
        for (var i = 0, len = array.length; i < len; ++i) {
            this[i] = array[i];
        }
        return this;
    };

    /**
     * General vector type.
     *
     * @name Vector
     * @class
     * @extends Dimensional
     * @param {Array | number} arrayOrNumber - An array whose entries will become the values of the
     * vector. The vector's dimension will be set to the array's length -or- a
     * number that will set the Vector's value. Each of the Vector's entries will
     * be set to zero.
     */
    function Vector(dimOrArray) {
        var dimension = (dimOrArray instanceof Array) ? dimOrArray.length : dimOrArray;
        Dimensional.call(this, dimension);
        if (typeof dimOrArray === 'number') {
            for (var i = 0; i < dimOrArray; ++i) {
                this.push(0);
            }
        } else if (dimOrArray instanceof Array) {
            var len = dimOrArray.length;
            for (var i = 0; i < len; ++i) {
                this.push(dimOrArray[i]);
            }
        } else {
            var msg = "Argument to Vector constructor must be an instance of Array or Number.";
            throw new TypeError(msg);
        }
    }
    Vector.prototype = Object.create(Dimensional.prototype);
    Vector.prototype.constructor = Vector;

    Object.defineProperty(Vector.prototype, "x", {
        get: function x() {
            return this[0];
        },
        set: function x(val) {
            return this[0] = val;
        }
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function y() {
            return this[1];
        },
        set: function y(val) {
            return this[1] = val;
        }
    });
    Object.defineProperty(Vector.prototype, "z", {
        get: function z() {
            return this[2];
        },
        set: function z(val) {
            return this[2] = val;
        }
    });
    Object.defineProperty(Vector.prototype, "mag", {
        get: function mag() {
            return this.magnitude();
        }
    });

    /**
     * @name copy
     * @memberof Vector
     * @function
     * @param {Vector} vector - The Vector to copy from.
     * @param {Vector} [out] - The Vector to copy to. If undefined, a
     * new Vector is created.
     * @returns {Vector} The out vector.
     */
    Vector.copy = function(vector, out) {
        if (out == null) {
            out = new Vector(vector);
        } else {
            var len = vector.length;
            out.length = len;
            for (var i = 0; i < len; ++i) {
                out[i] = vector[i];
            }
        }
        return out;
    };

    /**
     * @name flatten
     * @memberof Vector
     * @function
     * @param {Array} arrayOfVectors - An array of Vectors.
     * @param {constructor} [arrayType = Float32Array] - The type of Array to create. This method
     * can create typed arrays.
     * @returns {Array | TypedArray} a new Array or TypedArray who will be filled
     * with the values of the Vectors.
     */
    Vector.flatten = function(arrayOfVectors, arrayType) {
        arrayType = arrayType || Float32Array;

        var arr = arrayOfVectors.reduce(function(sum, ele) {
            return sum.concat(ele.toArray());
        }, []);

        if (arrayType === Array) {
            return arr;
        } else {
            return new arrayType(arr);
        }
    };

    /**
     * @name dot
     * @memberof Vector
     * @function
     * @throws {DimensionError} if the dimension of vec1 and vec2 are not equal.
     * @param {Vector} vec1 - The first Vector.
     * @param {Vector} vec2 - The second Vector.
     * @returns {number} The dot product of the two Vectors.
     */
    Vector.dot = function(vec1, vec2) {
        dimCheck(vec1, vec2);
        var out = 0;
        var len = vec1.length;
        for (var i = 0; i < len; ++i) {
            out += vec1[i] * vec2[i];
        }
        return out;
    };

    /**
     * @name cross
     * @memberof Vector
     * @function
     * @throws {DimensionError} if vec1 and vec2 are not 3-dimensional Vectors.
     * @param {Vector} vec1 - The first Vector.
     * @param {Vector} vec2 - The second Vector.
     * @param {Vector} [out] - The Vector that will contain the result
     * of the cross product of the two Vectors. If undefined, a new Vector is
     * created.
     * @returns {Vector} The out Vector.
     */
    Vector.cross = function(vec1, vec2, out) {
        if (vec1.length !== 3 || vec2.length !== 3) {
            throw new DimensionError("Cross product is only defined for three-dimensional vectors.");
        }
        if (typeof out === 'undefined') {
            out = new Vector(3);
        } else if (!(out instanceof Vector)) {
            throw new TypeError('out argument to Vector.cross must be a Vector or undefined.');
        }

        out.set(vec1[1] * vec2[2] - vec1[2] * vec2[1],
            vec1[2] * vec2[0] - vec1[0] * vec2[2],
            vec1[0] * vec2[1] - vec1[1] * vec2[0]);
        return out;
    };

    /**
     * @name quadrance
     * @memberof Vector
     * @function
     * @throws {DimensionError} if the dimension of vec1 and vec2 are not equal.
     * @param {Vector} vec1 - The first Vector.
     * @param {Vector} vec2 - The second Vector.
     * @returns {number} The quadrance of the two Vectors.
     */
    Vector.quadrance = function(vec1, vec2) {
        vec2 = vec2 || vec1;
        dimCheck(vec1, vec2);
        var out = 0;
        var len = vec1.length;
        for (var i = 0; i < len; ++i) {
            out += vec1[i] * vec2[i];
        }
        return out;
    };

    /**
     * Set the value of every entry of this Vector to 0.
     *
     * @name zero
     * @memberof Vector.prototype
     * @function
     * @returns {Vector} This Vector.
     */
    Vector.prototype.zero = function() {
        for (var i = 0, len = this.length; i < len; ++i) {
            this[i] = 0;
        }
    };

    /**
     * @name dot
     * @memberof Vector.prototype
     * @function
     * @param {Vector} vec - The Vector.
     * @returns {number} The dot product of this Vector and vec
     */
    Vector.prototype.dot = function(vec) {
        return Vector.dot(this, vec);
    }

    /**
     * @name quadrance
     * @memberof Vector.prototype
     * @function
     * @param {Vector} vec - The Vector.
     * @returns {number} The quadrance of this Vector and vector.
     */
    Vector.prototype.quadrance = function(vec) {
        return Vector.quadrance(this, vec);
    };

    /**
     * @name magnitude
     * @memberof Vector.prototype
     * @function
     * @returns {number} The magnitude (length) of this Vector.
     */
    Vector.prototype.magnitude = function() {
        return Math.sqrt(Vector.quadrance(this));
    };

    /**
     * Adds each entry of vec to the corresponding entries of this Vector.
     *
     * @name add_
     * @memberof Vector.prototype
     * @function
     * @throws {DimensionError} if the dimension of this Vector and vec are not equal.
     * @param {Vector} vec - The Vector
     * @returns {Vector} This Vector.
     */
    Vector.prototype.add_ = function(vec) {
        dimCheck(this, vec);
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            this[i] += vec[i];
        }
        return this;
    };

    /**
     * Adds each entry of vec to the corresponding entries of this Vector and returns a new vector.
     *
     * @name add
     * @memberof Vector.prototype
     * @function
     * @throws {DimensionError} if the dimension of this Vector and vec are not equal.
     * @param {Vector} vec - The Vector
     * @returns {Vector} New Vector.
     */
    Vector.prototype.add = function(vec) {
        var temp = Vector.copy(this);
        return temp.add_(vec);
    };

    Vector.prototype.sub_ = function(vec) {
        dimCheck(this, vec);
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            this[i] -= vec[i];
        }
        return this;
    };

    Vector.prototype.sub = function(vec) {
        var temp = Vector.copy(this);
        return temp.sub_(vec);
    };

    /**
     * Scales each entry of this Vector by scalar.
     *
     * @name scale
     * @memberof Vector.prototype
     * @function
     * @throws {TypeError} if scalar is not of type number.
     * @param {number} scalar - The scalar.
     * @returns {Vector} This Vector.
     */
    Vector.prototype.scale = function(scalar) {
        if (typeof scalar !== 'number') {
            throw new TypeError("argument to Vector.scale must be of type number.");
        }
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            this[i] *= scalar;
        }
        return this;
    };

    Vector.prototype.mul = function(scalar) {
        var temp = Vector.copy(this);
        return temp.scale(scalar);
    };

    Vector.prototype.div = function(scalar) {
        var temp = Vector.copy(this);
        return temp.scale(1 / scalar);
    };

    Vector.prototype.cross = function(vec) {
        return Vector.cross(this, vec);
    };

    Vector.prototype.rotateX = function(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return new Vector([
            this[0],
            this[1] * cos - this[2] * sin,
            this[1] * sin + this[2] * cos,
        ]);
    };

    Vector.prototype.rotateY = function(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return new Vector([
            this[0] * cos + this[2] * sin,
            this[1],
            -this[0] * sin + this[2] * cos,
        ]);
    };

    Vector.prototype.rotateZ = function(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return new Vector([
            this[0] * cos - this[1] * sin,
            this[0] * sin + this[1] * cos,
            this[2],
        ]);
    };

    /**
     * @name set
     * @memberof Vector.prototype
     * @function
     * @throws {DimensionError} if the dimension of this Vector and array are not equal.
     * @param {array} array - The array.
     * @returns {Vector} this Vector
     */
    /**
     * @name set^2
     * @memberof Vector.prototype
     * @function
     * @throws {DimensionError} if the dimension of this Vector and the number of
     * varargs are not equal.
     * @param {...number} varargs - Numbers this Vectors entries will be set from.
     * @returns {Vector} This Vector.
     */
    Vector.prototype.set = function(arrayOrVarargs) {
        var vals = (arguments.length === 1) ? arguments[0] : arguments;
        if (vals.length == null) {
            vals = [vals];
        }
        dimCheck(this, vals);
        for (var i = 0, len = this.length; i < len; ++i) {
            this[i] = vals[i];
        }
        return this;
    };

    /**
     * Normalizes this Vector.
     *
     * @name normalize
     * @memberof Vector.prototype
     * @function
     * @returns {Vector} This Vector.
     */
    Vector.prototype.normalize = function() {
        var mag = this.magnitude();
        for (var i = 0, len = this.length; i < len; ++i) {
            this[i] /= mag;
        }
        return this;
    }

    /**
     * This handles some edge cases such as Array.concat in which a subtype of Array
     * is not considered an Array.
     *
     * @name toArray
     * @memberof Vector.prototype
     * @function
     * @returns {Array} An Array whose entries are set from this Vector.
     */
    Vector.prototype.toArray = function() {
        return this.map(function(ele) {
            return ele;
        });
    };

    /**
     * @name toString
     * @memberof Vector.prototype
     * @function
     * @returns {string} A string representation of this Vector.
     */
    Vector.prototype.toString = function() {
        return '( ' + this.reduce(function(sum, ele) {
                return sum + ', ' + ele;
            }) + ' )';
    };

    /**
     * General matrix type.
     *
     * This Matrix type stores values in row-major order, so a Matrix must be
     * transposed before sending its values to an OpenGL shader.
     *
     * @name Matrix
     * @class
     * @extends Dimensional
     * @param {number} [m = 4] The number of rows in the matrix.
     * @param {number} [n = 4] The number of columns in the matrix.
     */
    function Matrix(m, n) {
        m = m || 4;
        n = n || 4;
        this.dim = new Dimensions([m, n]);
        for (var i = 0; i < m; ++i)
            for (var j = 0; j < n; ++j) {
                if (i === j) {
                    this.push(1);
                } else {
                    this.push(0);
                }
            }
    }
    Matrix.prototype = Object.create(Dimensional.prototype);
    Matrix.prototype.constructor = Matrix;

    Matrix.cache1 = new Matrix(4, 4);
    Matrix.cache2 = new Matrix(4, 4);

    /**
     * @name mul
     * @memberof Matrix
     * @function
     * @throws {TypeError} if mat2 is not an instance of Matrix or Vector.
     * @throws {DimensionError} if mat1 and mat2 are not compatable for multiplication.
     * @param {Matrix} mat1 - The left Matrix.
     * @param {matrix | Vector} mat2 - The right Matrix.
     * @param {Matrix | undefined} out - The result of the matrix multiplication.
     * If undefined, a new Matrix is created.
     * @returns {Matrix} The out matrix.
     */
    Matrix.mul = function(mat1, mat2, out) {
        var m1, m2, n1, n2;

        m1 = mat1.dim[0];
        n1 = mat1.dim[1];

        if (mat2 instanceof Matrix) {
            m2 = mat2.dim[0];
            n2 = mat2.dim[1];

            if (out == null) {
                out = new Matrix(m1, n2);
                out.zero();
            } else {
                out.dim = [m1, n2];
                out.zero();
            }

        } else if (mat2 instanceof Vector) {
            m2 = mat2.length;
            n2 = 1;

            if (out == null) {
                out = new Vector(mat2.length);
            } else {
                out.zero();
            }

        } else {
            throw new TypeError('second argument to Matrix.mul must be instance of Matrix or Vector');
        }

        if (n1 !== m2) {
            throw new DimensionError('left matrix n = ' + n1 + ', right matrix m = ' + m2);
        }

        for (var i = 0; i < m1; ++i)
            for (var j = 0; j < n2; ++j)
                for (var e = 0; e < n1; ++e) {
                    out[j + n2 * i] += mat1[e + n1 * i] * mat2[n2 * e + j];
                }
        return out;
    };

    /**
     * @name copy
     * @memberof Matrix
     * @function
     * @param {Matrix} matrix - The matrix that will be copied.
     * @param {Matrix} [out] - The Matrix to copy into. If undefined, a
     * new Matrix is created.
     * @returns {Matrix} The out Matrix.
     */
    Matrix.copy = function(matrix, out) {
        if (out == null) {
            out = new Matrix(matrix.dim[0], matrix.dim[1]);
        } else {
            out.dim = [matrix.dim[0], matrix.dim[1]];
        }

        for (var i = 0; i < matrix.length; ++i) {
            out[i] = matrix[i];
        }
        return out;
    };

    /**
     * @name det
     * @memberof Matrix
     * @function
     * @throws {DimensionError} if matrix is not square.
     * @param {Matrix} matrix - The Matrix.
     * @returns {number} The determinant of matrix.
     */
    Matrix.det = function(matrix) {
        if (matrix.dim[0] !== matrix.dim[1]) {
            var msg = 'determinant is only defined for square matrices';
            throw new DimensionError(msg);

        } else if (matrix.dim[0] === 2) {
            return matrix[0] * matrix[3] - matrix[1] * matrix[2];

        } else if (matrix.dim[0] === 3) {
            var m = matrix;
            var x = m[0] * (m[4] * m[8] - m[5] * m[7]);
            var y = m[1] * (m[3] * m[8] - m[5] * m[6]);
            var z = m[2] * (m[3] * m[7] - m[4] * m[6]);
            return x - y + z;

        } else if (matrix.dim[0] === 4) {
            var m = matrix;
            var xy = m[8] * m[13] - m[9] * m[12];
            var xz = m[8] * m[14] - m[10] * m[12];
            var xw = m[8] * m[15] - m[11] * m[12];
            var yz = m[9] * m[14] - m[10] * m[13];
            var yw = m[9] * m[15] - m[11] * m[13];
            var zw = m[10] * m[15] - m[11] * m[14];
            var x = m[0] * (m[5] * zw - m[6] * yw + m[7] * yz);
            var y = m[1] * (m[4] * zw - m[6] * xw + m[7] * xz);
            var z = m[2] * (m[4] * yw - m[5] * xw + m[7] * xy);
            var w = m[3] * (m[4] * yz - m[5] * xz + m[6] * xy);
            return x - y + z - w;
        }

        var det = 0;
        for (var j = 0, d = matrix.dim[0]; j < d; ++j) {
            var md = matrix[j] * Matrix.det(Matrix.minor(matrix, 0, j));
            det += (j % 2 === 0) ? md : -md;
        }

        return det;
    };

    /**
     * @name invert
     * @memberof Matrix
     * @function
     * @throws {ReferenceError} if matrix is undefined.
     * @throws {DimensionError} if matrix is not square.
     * @throws {RangeError} if matrix is singular.
     * @param {Matrix} matrix - The matrix to invert.
     * @param {Matrix} [out] - The Matrix whose entries will be set to the inverse
     * of matrix. If undefined, a new Matrix will be created.
     * @returns {Matrix} The out Matrix.
     */
    Matrix.invert = function(matrix, out) {
        if (typeof matrix === 'undefined') {
            var msg = 'First argument to Matrix.invert is undefined';
            throw new ReferenceError(msg);
        }
        if (matrix.dim[0] !== matrix.dim[1]) {
            var msg = 'Matrix.invert requires a square matrix.';
            throw new DimensionError(msg);
        }
        var det = Matrix.det(matrix);
        if (det === 0) {
            var msg = 'Cannot invert a singular matrix.';
            throw new RangeError(msg);
        }
        var mat = matrix;
        if (mat.dim[0] === 2) {
            return mat.set([mat[3] / det, -mat[1] / det, -mat[2] / det, mat[0] / det]);
        }

        var d = mat.dim[0];
        if (typeof out === 'undefined') {
            out = new Matrix(d, d);
        } else {
            out.dim[0] = mat.dim[0];
            out.dim[1] = mat.dim[1];
        }
        var minor;
        if (d < 6) {
            minor = Matrix.cache1;
            minor.dim[0] = d;
            minor.dim[1] = d;
        } else {
            minor = new Matrix(d - 1, d - 1);
        }

        for (var i = 0; i < d; ++i)
            for (var j = 0; j < d; ++j) {
                var ind = i * d + j;
                out[ind] = Matrix.det(Matrix.minor(mat, i, j, minor));
                if (i % 2 !== j % 2) {
                    out[ind] *= -1;
                }
            }
        for (var i = 0, len = mat.length; i < len; ++i) {
            out[i] /= det;
        }
        return out.transpose();
    };

    /**
     * Finds a minor of a Matrix. The index arguments begin at 0, so to remove the
     * first row of matrix, pass 0 as the argument to di.
     *
     * @name minor
     * @memberof Matrix
     * @function
     * @param {Matrix} matrix - The matrix.
     * @param {number} di - The index of the row to be removed from matrix.
     * @param {number} dj - The index of the column to be removed from matrix.
     * @param {Matrix} [out] - The matrix whose Dimensions and entries will be set
     * to the specified minor of matrix. If undefined, a new Matrix is created.
     * @returns {Matrix} The out Matrix.
     */
    Matrix.minor = function(matrix, di, dj, out) {
        var m = matrix.dim[0];
        var n = matrix.dim[1];
        var arr = [];
        if (typeof out === 'undefined') {
            out = new Matrix(m - 1, n - 1);
        } else {
            out.dim[0] = m - 1;
            out.dim[1] = n - 1;
        }

        row: for (var i = 0; i < m; ++i) {
            col: for (var j = 0; j < n; ++j) {
                if (i === di) {
                    continue row;
                }
                if (j === dj) {
                    continue col;
                }

                arr.push(matrix[i * m + j]);
            }
        }
        return out.set(arr);
    };

    /**
     * @name set
     * @memberof Matrix.prototype
     * @function
     * @throws {RangeError} if array.length + offset > the number of entries in this Matrix.
     * @param {Array} array - The array whose values will be set in this Matrix.
     * @param {number} [offset] - The offset to begin filling. If
     * undefined, offset will be set to 0.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.set = function(array, offset) {
        offset = offset || 0;
        if (array.length + offset > this.length) {
            var msg = 'Matrix.prototype.set arguments array + offset greater than this matrix.length';
            throw new RangeError(msg);
        }

        for (var i = 0, len = array.length; i < len; ++i) {
            this[i + offset] = array[i];
        }
        return this;
    };

    /**
     * Sets the ij entry of this Matrix. The index arguments begin at 1, so to set
     * the entry in the second row and third column, pass 2 and 3 as the arguments
     * to i and j, respectively.
     *
     * @name setEntry
     * @memberof Matrix.prototype
     * @function
     * @param {number} m - The row index.
     * @param {number} n - The column index.
     * @param {number} val - The value.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.setEntry = function(m, n, val) {
        this[n - 1 + (m - 1) * this.dim[1]] = val;
        return this;
    };

    /**
     * Sets this Matrix to the identity matrix or its analogue of this Matrix os
     * not square. (i.e., acts like the Kronecker delta over the indicies)
     *
     * @name identity
     * @memberof Matrix.prototype
     * @function
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.identity = function() {
        var m = this.dim[0];
        var n = this.dim[1];

        for (var i = 0; i < m; ++i)
            for (var j = 0; j < n; ++j) {
                this[j + i * n] = (i === j) ? 1 : 0;
            }
        return this;
    };

    /**
     * Sets every entry of this Matrix to 0.
     *
     * @name zero
     * @memberof Matrix.prototype
     * @function
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.zero = function() {
        var len = this.dim[0] * this.dim[1];
        for (var i = 0; i < len; ++i) {
            this[i] = 0;
        }
        return this;
    }

    /**
     * Multiplies this Matrix by matrix.
     *
     * @name mul
     * @memberof Matrix.prototype
     * @function
     * @throws {ReferenceError} if matrix is undefined.
     * @throws {TypeError} if matrix is not an instance of Matrix.
     * @throws {DimensionError} if this Matrix and matrix are not compatable for
     * multiplication.
     * @param {Matrix} matrix - The right-side multiplicand.
     * @returns {Matrix} - This Matrix.
     */
    Matrix.prototype.mul = function(matrix) {
        var m1 = this.dim[0];
        var n1 = this.dim[1];
        var m2, n2;

        if (typeof matrix === 'undefined') {
            var msg = 'Argument to Matrix.prototype.mul must be defined.';
            throw new ReferenceError(msg);
        } else if (matrix instanceof Matrix) {
            m2 = matrix.dim[0];
            n2 = matrix.dim[1];
        } else {
            var msg = 'Argument to Matrix.prototype.mul must be instance of Matrix. ';
            msg += 'If you want to multiply a vector by this matrix then use Matrix.mul';
            throw new TypeError(msg);
        }

        var cache = Matrix.cache1;
        cache.dim.set(this.dim);

        if (n1 !== m2) {
            throw new DimensionError('this matrix n = ' + n1 + ', other matrix m = ' + m2);
        }

        for (var i = 0, len = this.length; i < len; ++i) {
            cache[i] = this[i];
            this[i] = 0;
        }

        this.dim.set(matrix.dim);

        for (var i = 0; i < m1; ++i)
            for (var j = 0; j < n2; ++j)
                for (var e = 0; e < n1; ++e) {
                    this[j + n2 * i] += cache[e + n1 * i] * matrix[n2 * e + j];
                }
        return this;
    };

    /**
     * @name det
     * @memberof Matrix.prototype
     * @function
     * @returns {number} The determinant of this Matrix.
     */
    Matrix.prototype.det = function() {
        return Matrix.det(this);
    };

    /**
     * Inverts this Matrix.
     *
     * @name invert
     * @memberof Matrix.prototype
     * @function
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.invert = function() {
        var cache = Matrix.cache2;
        cache.dim[0] = this.dim[0];
        cache.dim[1] = this.dim[1];
        cache.set(this);
        return Matrix.invert(cache, this);
    };

    /**
     * Transposes this Matrix.
     *
     * @name transpose
     * @memberof Matrix.prototype
     * @function
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.transpose = function() {
        var len = this.length;
        var m = this.dim[0];
        var n = this.dim[1];
        var cache = Matrix.cache1;

        cache.dim.set([m, n]);

        for (var i = 0; i < len; ++i) {
            cache[i] = this[i];
        }

        this.dim.set([n, m]);
        for (var i = 0; i < m; ++i)
            for (var j = 0; j < n; ++j) {
                this[i + m * j] = cache[j + i * n];
            }
        return this;
    };

    /**
     * Sets this matrix as a view Matrix.
     *
     * @name asView
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix is not a 4x4 Matrix.
     * @throws {TypeError} if position is not and instance of Array.
     * @param {Array} position - An array containing the starting x, y, and z
     * coordinates of this view Matrix.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.asView = function(position) {
        dimCheck(this, {
            dim: [4, 4]
        });
        position = position || [0, 0, 0];
        if (!(position instanceof Array)) {
            var msg = 'Matrix.prototype.asView argument must be an instance of Array'
            throw new TypeError(msg);
        }
        this.dim.set([4, 4]);
        this.identity();
        this[3] = position[0];
        this[7] = position[1];
        this[11] = position[2];
        return this;
    }

    /**
     * @name asOrtographic
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix is not a 4x4 Matrix.
     * @throws {RangeError} if the arguments to right and left, top and bottom, or
     * far and near are equal.
     * @param {number} left - The x coordinate of the left frustum plane.
     * @param {number} right - The x coordinate of the right frustum plane.
     * @param {number} bottom - The y coordinate of the bottom frustum plane.
     * @param {number} top - The y coordinate of the top frustum plane.
     * @param {number} near - The z coordinate of the near frustum plane.
     * @param {number} far - The z coordinate of the far frustum plane.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.asOrthographic = function(left, right, bottom, top, near, far) {
        try {
            dimCheck(this, {
                dim: [4, 4]
            });
        } catch (e) {
            e.message = 'Matrix.prototype.asOrthographic requires this matrix to be a 4x4 matrix, ';
            e.message += 'but this matrix is a ' + this.dim[0] + 'x' + this.dim[1] + ' matrix.';
            throw e;
        }

        if (right - left === 0) {
            var msg = 'Matrix.prototype.asOrthographic: right and left cannot have the same value';
            throw new RangeError(msg);
        }
        if (top - bottom === 0) {
            var msg = 'Matrix.prototype.asOrthographic: top and bottom cannot have the same value';
            throw new RangeError(msg);
        }
        if (far - near === 0) {
            var msg = 'iMatrix.prototype.asOrthographic: far and near cannot have the same value';
            throw new RangeError(msg);
        }

        this.dim.set([4, 4]);
        this.identity();
        this[0] = 2 / (right - left);
        this[3] = -(right + left) / (right - left);
        this[5] = 2 / (top - bottom);
        this[6] = 0;
        this[7] = -(top + bottom) / (top - bottom);
        this[10] = -2 / (far - near);
        this[11] = -(far + near) / (far - near);

        return this;
    };

    /**
     * @name asPerspective
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix is not a 4x4 Matrix.
     * @throws {RangeError} if the arguments to near and far are equal or if
     * the argument to aspect is 0.
     * @param {number} near - The distance from the camera to the near clipping
     * plane.
     * @param {number} far - The distance from the camera to the far clipping
     * plane.
     * @param {number} aspect - The aspect ratio.
     * @param {number} fov - The field of view angle.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.asPerspective = function(near, far, aspect, fov) {
        try {
            dimCheck(this, {
                dim: [4, 4]
            });
        } catch (e) {
            e.message = 'Matrix.prototype.asPerspective requires this matrix to be a 4x4 matrix, ';
            e.message += 'but this matrix is a ' + this.dim[0] + 'x' + this.dim[1] + ' matrix.';
            throw e;
        }

        if (far - near === 0) {
            var msg = 'Matrix.prototype.asPerspective: near and far cannot have the same value.';
            throw new RangeError(msg);
        }
        if (aspect === 0) {
            var msg = 'Matrix.prototype.asPerspective: aspect cannot equal zero.';
            throw new RangeError(msg);
        }
        near = (near === 0) ? Number.MIN_VALUE : near;
        far = (far === 0) ? Number.MIN_VALUE : far;
        fov = (fov === 0) ? Number.MIN_VALUE : fov;


        var top = near * Math.tan(fov);
        var right = top * aspect;

        this.dim.set([4, 4]);
        this.identity();
        this[0] = near / right;
        this[5] = near / top;
        this[10] = -(far + near) / (far - near);
        this[11] = -2 * far * near / (far - near);
        this[14] = -1;
        this[15] = 0;

        return this;
    };

    /**
     * If this Matrix is a 2x2 Matrix, sets this Matrix as a non-homogeneous
     * rotation Matrix. Else if this Matrix is a 3x3 Matrix, sets this Matrix as a
     * homogeneous rotation Matrix.
     *
     * @name asRotation
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix not square or if it is not a 2x2 or
     * 3x3 Matrix.
     * @param {number} angle - The angle of rotation.
     * @returns {Matrix} This Matrix.
     */
    /**
     * If this Matrix is a 3x3 Matrix, sets this Matrix as a non-homogeneous
     * rotation Matrix. Else if this Matrix is a 4x4 Matrix, sets this Matrix as a
     * homogeneous rotation Matrix.
     *
     * @name asRotation^2
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix is not square or if it is not a 3x3 or 4x4 Matrix.
     * @param {Array} axis - The axis of rotation.
     * @param {number} angle - The angle of rotation.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.asRotation = function() {

        if (this.dim[0] > 4 || this.dim[1] > 4) {
            var msg = 'Matrix.prototype.asRotation does not support matrices of dim > 4, ';
            msg += 'but this matrix is a ' + this.dim[0] + 'x' + this.dim[1] + ' matrix';
            throw new DimensionError(msg);
        } else if (this.dim[0] !== this.dim[1]) {
            var msg = 'Matrix.prototype.asRotation requires this matrix to be square, ';
            msg += 'but this matrix is a ' + this.dim[0] + 'x' + this.dim[1] + ' matrix';
            throw new DimensionErrror(msg);
        }

        if (typeof arguments[0] === 'number') {
            var angle = arguments[0];
            var c = Math.cos(angle);
            var s = Math.sin(angle);

            // non-homogeneous 2x2 matrix
            if (this.dim[0] === 2 && this.dim[1] === 2) {
                this[0] = c;
                this[1] = -s;
                this[2] = s;
                this[3] = c;

                // homogeneous 3x3 matrix
            } else if (this.dim[0] === 3 && this.dim[1] === 3) {
                this[0] = c;
                this[1] = -s;
                this[2] = 0;
                this[3] = s;
                this[4] = c;
                this[5] = 0;
                this[6] = 0;
                this[7] = 0;
                this[8] = 0;

            } else {
                var msg = 'Matrix.prototype.asRotation with first argument of type number requires this ';
                msg += 'matrix to be a non-homogeneous 2x2 matrix or a homogeneous 3x3 matrix, but ';
                msg += 'this matrix dim is ' + this.dim[0] + 'x' + this.dim[1] + '.';
                throw new DimensionError(msg);
            }

        } else if (arguments[0] instanceof Array) {
            var axis = arguments[0];
            var x = axis[0];
            var y = axis[1];
            var z = axis[2];

            if (x === 0 && y === 0 && z === 0) {
                throw new RangeError('Matrix.prototype.asRotation: axis cannot be the zero vector');
            }

            var mag = Math.sqrt(x * x + y * y + z * z);
            x /= mag;
            y /= mag;
            z /= mag;

            var c = Math.cos(arguments[1]);
            var s = Math.sin(arguments[1]);
            var t = 1 - c;

            // non-homogeneous 3x3 matrix
            if (this.dim[0] === 3 && this.dim[1] === 3) {
                this[0] = x * x * t + c;
                this[1] = x * y * t - z * s;
                this[2] = x * z * t + y * s;
                this[3] = x * y * t + z * s;
                this[4] = y * y * t + c;
                this[5] = y * z * t - x * s;
                this[6] = x * z * t - y * s;
                this[7] = y * z * t + x * s;
                this[8] = z * z * t + c;

                // homogeneous 4x4 matrix
            } else if (this.dim[0] === 4 && this.dim[1] === 4) {
                this[0] = x * x * t + c;
                this[1] = x * y * t - z * s;
                this[2] = x * z * t + y * s;
                this[3] = 0;
                this[4] = x * y * t + z * s;
                this[5] = y * y * t + c;
                this[6] = y * z * t - x * s;
                this[7] = 0;
                this[8] = x * z * t - y * s;
                this[9] = y * z * t + x * s;
                this[10] = z * z * t + c;
                this[11] = 0;
                this[12] = 0;
                this[13] = 0;
                this[14] = 0;
                this[15] = 1;
            } else {
                var msg = 'Matrix.prototype.asRotation with first argument instnaceof Array requires ';
                msg += 'this matrix to be a non-homogeneous 3x3 matrix or a homogeneous 4x4 matrix, but ';
                msg += 'this matrix dim is ' + this.dim[0] + 'x' + this.dim[1] + '.';
                throw new DimensionError(msg);
            }

        } else {
            var msg = 'Matrix.prototype.asRotation first argument must be of type number or ';
            msg += 'instanceof Array.';
        }

        return this;
    }

    /**
     * @name asTranslation
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix is not square, if this Matrix is a
     * 2x2 Matrix, or if the array argument's length is not one less than the
     * number of columns in this Matrix.
     * @param {Array} array - An array containing the x, y, [...] translation coordinates.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.asTranslation = function(vector) {
        var m = this.dim[0];
        var n = this.dim[1];
        var len = vector.length;

        if (this.dim[0] !== this.dim[1]) {
            var msg = 'Matrix.prototype.asTranslation requires this matrix to be square, ';
            msg += 'but this matrix is a ' + this.dim[0] + 'x' + this.dim[1] + ' matrix';
            throw new DimensionError(msg);
        }
        if (this.dim[0] < 3) {
            var msg = 'Matrix.prototype.asTranslation requries this matrix to have dim >= 3, ';
            msg += 'but this matrix is a ' + this.dim[0] + 'x' + this.dim[1] + ' matrix';
            throw new DimensionError(msg);
        }
        if (m - 1 !== len) {
            var msg = 'Matrix.prototype.asTranslation: argument length must be one less than the number ';
            msg += 'of rows in this matrix';
            throw new DimensionError(msg);
        }

        this.identity();
        for (var i = 0; i < len; ++i) {
            this[(i + 1) * n - 1] = vector[i];
        }
        return this;
    };

    /**
     * Sets the scale values for each dimension or this matrix to the values of
     * array.
     *
     * @name asScale
     * @memberof Matrix.prototype
     * @function
     * @throws {RangeError} if the array argument's length is not one less than
     * the number of columns in this Matrix.
     * @param {Array} array - An array containing the x, y, [...] scale values.
     * @returns {Matrix} This Matrix.
     */
    /**
     * Sets the scale values for each dimension of this matrix to the value of the
     * number argument.
     *
     * @name asScale^2
     * @memberof Matrix.prototype
     * @function
     * @param {number} number - The number to set as the scale value for each
     * dimension of this Matrix.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.asScale = function(arrayOrScalar) {
        var m = this.dim[0];
        var n = this.dim[1];

        this.identity();

        if (typeof arrayOrScalar === 'number') {
            for (var i = 0; i < m - 1; ++i) {
                this[i + i * n] = arrayOrScalar;
            }
        } else {
            if (arrayOrScalar.length !== m - 1) {
                var msg = 'Matrix.prototype.asScale array argument length must be one minus the number ';
                msg += 'of rows in this matrix because asScale only supports homogeneous coordinates.';
                throw new RangeError(msg);
            }
            for (var i = 0; i < m - 1; ++i) {
                this[i + i * n] = arrayOrScalar[i];
            }
        }

        return this;
    };

    /**
     * Rotates this Matrix by angle.
     *
     * @name rotate
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix not square or if it is not a 2x2 or
     * 3x3 Matrix.
     * @param {number} angle - The angle of rotation.
     * @returns {Matrix} This Matrix.
     */
    /**
     * Rotates this Matrix around axis by angle.
     *
     * @name rotate
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix is not square or if it is not a 3x3 or 4x4 Matrix.
     * @param {Array} axis - The axis of rotation.
     * @param {number} angle - The angle of rotation.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.rotate = function(axis, angle) {
        Matrix.cache2.dim.set(this.dim);
        try {
            this.mul(Matrix.cache2.asRotation(axis, angle));
        } catch (e) {
            e.message = e.message.replace('asRotation', 'rotate');
            throw e;
        }

        return this;
    }

    /**
     * @name translate
     * @memberof Matrix.prototype
     * @function
     * @throws {DimensionError} if this Matrix is not square, if this Matrix is a
     * 2x2 Matrix, or if the array argument's length is not one less than the
     * number of columns in this Matrix.
     * @param {Vector} vector - A vector whose entries represent the x, y, [...]
     * translation values.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.translate = function(vector) {
        Matrix.cache2.dim.set(this.dim);
        try {
            this.mul(Matrix.cache2.asTranslation(vector));
        } catch (e) {
            e.message = e.message.replace('asTranslation', 'translate');
            throw e;
        }

        return this;
    }

    /**
     * Scales this Matrix by the values of array.
     *
     * @name scale
     * @memberof Matrix.prototype
     * @function
     * @throws {RangeError} if the array argument's length is not one less than
     * the number of columns in this Matrix.
     * @param {Array} array - An array containing the x, y, [...] scale values.
     * @returns {Matrix} This Matrix.
     */
    /**
     * Scales each dimension of this matrix by the value of the number argument.
     *
     * @name scale^2
     * @memberof Matrix.prototype
     * @function
     * @param {number} number - The number to set as the scale value for each
     * dimension of this Matrix.
     * @returns {Matrix} This Matrix.
     */
    Matrix.prototype.scale = function(arrayOrScalar) {
        Matrix.cache2.dim.set(this.dim);
        try {
            this.mul(Matrix.cache2.asScale(arrayOrScalar));
        } catch (e) {
            e.message = e.message.replace('asScale', 'scale');
            throw e;
        }

        return this;
    }

    /**
     * @name toString
     * @memberof Matrix.prototype
     * @function
     * @returns {string} A string representation of this Matrix.
     */
    Matrix.prototype.toString = function() {
        var str = '';
        var m = this.dim[0];
        var n = this.dim[1];

        for (var i = 0; i < m; ++i) {
            if (i !== 0) {
                str += ' ';
            }
            for (var j = 0; j < n; ++j) {
                str += this[j + i * n];
                if (j !== n - 1) {
                    str += ' ';
                }
            }
            if (i !== m - 1) {
                str += '\n';
            }
        }
        return str;
    };

    /**
     * Quaternion type.
     *
     * @name Quaternion
     * @class
     * @extends Dimensional
     */
    function Quaternion() {
        this.t = 1;
        this.v = new Vector(3);
        this.dim = new Dimensions(4);
    }
    Quaternion.prototype = Object.create(Dimensional.prototype);
    Quaternion.prototype.constructor = Quaternion;
    Quaternion.prototype.equals = function(quaternion) {
        return (this.t === quaternion.t && this.v.equals(quaternion.v));
    };

    Quaternion.cache1 = new Quaternion(4);
    Quaternion.cache2 = new Quaternion(4);

    Quaternion.copy = function(q, out) {
        if (out == null) {
            out = new Quaternion();
        }
        out.t = q.t;
        out.v = Vector.copy(q.v);
        out.dim = Dimensions.copy(q.dim);
        return out;
    };

    /**
     * @name mul
     * @memberof Quaternion
     * @function
     * @param {Quaternion} q1 - The left multiplicand.
     * @param {Quaternion} q2 - The right multiplicand.
     * @param {Quaternion} [out] - The Quaternion to store the result of
     * the multiplication. If undefined, a new Quaternion is created.
     * @returns {Quaternion} The out Quaternion.
     */
    Quaternion.mul = function(q1, q2, out) {
        out = out || new Quaternion();
        var q1V = q1.v;
        var q2V = q2.v;
        var outV = out.v;
        var w = q1.t;
        var x = q1V[0];
        var y = q1V[1];
        var z = q1V[2];
        var ow = q2.t;
        var ox = q2V[0];
        var oy = q2V[1];
        var oz = q2V[2];

        out.t = w * ow - x * ox - y * oy - z * oz;
        outV[0] = w * ox + x * ow + y * oz - z * oy;
        outV[1] = w * oy - x * oz + y * ow + z * ox;
        outV[2] = w * oz + x * oy - y * ox + z * ow;

        return out;
    };

    /**
     * @name invert
     * @memberof Quaternion
     * @function
     * @param {Quaternion} quaternion - The Quaternion to invert.
     * @param {Quaternion} [out] - The Quaternion to store the result of the inversion.
     * If undefined, a new Quaternion is created.
     * @returns {Quaternion} The out Quaternion.
     */
    Quaternion.invert = function(quaternion, out) {
        out = out || new Quaternion();

        var vin = quaterinon.v;
        var vout = out.v;
        var quad = quaternion.quadrance();
        out.t = quaternion.t * invQuad;
        vout[0] = -vin[0] / quad;
        vout[1] = -vin[1] / quad;
        vout[2] = -vin[2] / quad;

        return out;
    };

    /**
     * @name conjugate
     * @memberof Quaternion
     * @function
     * @param {Quaternion} quaternion - The Quaterion.
     * @param {Quaternion} [out] - The Quaternion to store the conjugate
     * in. If undefined, a new Quaternion is created.
     * @returns {Quaternion} The out Quaternion.
     */
    Quaternion.conjugate = function(quaternion, out) {
        out = out || new Quaternion();
        var vin = quaternion.v;
        var vout = out.v;

        out.t = quaternion.t;
        vout[0] = -vin[0];
        vout[1] = -vin[1];
        vout[2] = -vin[2];

        return out;
    };

    /**
     * @name quadrance
     * @memberof Quaternion.prototype
     * @function
     * @returns {number} The quadrance of this Quaternion.
     */
    Quaternion.prototype.quadrance = function() {
        var v = this.v;
        return this.t * this.t + v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    };

    /**
     * @name length
     * @memberof Quaternion.prototype
     * @function
     * @returns {number} The length (magnitude) of this Quaternion.
     */
    Quaternion.prototype.length = function() {
        return Math.sqrt(this.quadrance());
    };

    /**
     * Inverts this Quaternion.
     *
     * @name invert
     * @memberof Quaternion.prototype
     * @function
     * @returns {Quaternion} This Quaternion.
     */
    Quaternion.prototype.invert = function() {
        var v = this.v;
        var quad = this.quadrance();
        this.t /= quad;
        v[0] /= -quad;
        v[1] /= -quad;
        v[2] /= -quad;
        return this;
    };

    /**
     * Conjugates this Quaternion.
     *
     * @name conjugate
     * @memberof Quaternion.prototype
     * @function
     * @returns {Quaternion} This Quaternion.
     */
    Quaternion.prototype.conjugate = function() {
        this.v.scale(-1);
        return this;
    };

    /**
     * Normalizes this Quaternion.
     *
     * @name normalize
     * @memberof Quaternion.prototype
     * @function
     * @returns {Quaternion} This Quaternion
     */
    Quaternion.prototype.normalize = function() {
        var len = this.length();

        this.t /= len;
        this.v.scale(1 / len);

        return this;
    };

    /**
     * Rotates a Vector by this Quaternion.
     *
     * @name rotate
     * @memberof Quaternion.prototype
     * @function
     * @param {Vector} vector - The Vector to rotate by this Quaternion.
     * @returns {Vector} The rotated Vector.
     */
    Quaternion.prototype.rotate = function(vector) {
        var v = this.v;
        var t = this.t;
        var cx = Vector.cross(v, [vector[0], vector[1], vector[2]]).scale(2);
        var cx2 = Vector.cross(v, cx);
        vector[0] += t * cx[0] + cx2[0];
        vector[1] += t * cx[1] + cx2[1];
        vector[2] += t * cx[2] + cx2[2];
        return vector;
    };

    /**
     * Rotates this Quaternion by quaternion.
     *
     * @name mul
     * @memberof Quaternion.prototype
     * @function
     * @param {Quaternion} quaternion - The right-side multiplicand.
     * @returns {Quaternion} This Quaternion.
     */
    Quaternion.prototype.mul = function(quaternion) {
        var thisV = this.v;
        var otherV = quaternion.v;
        var w = this.t;
        var x = thisV[0];
        var y = thisV[1];
        var z = thisV[2];
        var ow = quaternion.t;
        var ox = otherV[0];
        var oy = otherV[1];
        var oz = otherV[2];

        this.t = w * ow - x * ox - y * oy - z * oz;
        thisV[0] = w * ox + x * ow + y * oz - z * oy;
        thisV[1] = w * oy - x * oz + y * ow + z * ox;
        thisV[2] = w * oz + x * oy - y * ox + z * ow;

        return this;
    };

    /**
     * Sets the orientation of this Quaternion to a rotation of angle around axis.
     *
     * @name setAxisAngle
     * @memberof Quaternion.prototype
     * @function
     * @throws {TypeError} if axis is not an instance of Array or if angle is not
     * of type number.
     * @param {Array} axis - The axis of rotation.
     * @param {number} angle - The angle of rotation.
     * @returns {Quaternion} This Quaternion.
     */
    Quaternion.prototype.setAxisAngle = function(axis, angle) {
        if (!(axis instanceof Array)) {
            var msg = 'Quaternion.prototype.setAxisAngle axis argument must be an instance of Array';
            throw new TypeError(msg);
        }
        if (typeof angle !== 'number') {
            var msg = 'Quaternion.prototype.SetAxisAngle angle argument must be of type Number';
            throw new TypeError(msg);
        }
        var len = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
        this.t = Math.cos(angle / 2);
        this.v.set(axis).scale(Math.sin(angle / 2) / len);
        return this;
    };

    Quaternion.prototype.setFromEuler = function(x, y, z) {
        const cosX = Math.cos(x / 2);
        const cosY = Math.cos(y / 2);
        const cosZ = Math.cos(z / 2);
        const sinX = Math.sin(x / 2);
        const sinY = Math.sin(y / 2);
        const sinZ = Math.sin(z / 2);
        this.t = cosX * cosY * cosZ + sinX * sinY * sinZ;
        this.v.set([
            sinX * cosY * cosZ - cosX * sinY * sinZ,
            cosX * sinY * cosZ + sinX * cosY * sinZ,
            cosX * cosY * sinZ - sinX * sinY * cosZ
        ]);
        return this;
    };

    /**
     * @name toMatrix
     * @memberof Quaternion.prototype
     * @function
     * @throws {DimensionError} if matrix is not a 3x3 matrix, 4x4 matrix, or undefined.
     * @param {Matrix} [matrix] - The matrix to be set as a
     * rotation-matrix representation of this Quaternion. If undefined, a new
     * Matrix is created.
     * @returns {Matrix} The Matrix.
     */
    Quaternion.prototype.toMatrix = function(matrix) {
        if (typeof matrix === 'undefined') {
            matrix = new Matrix();
        }

        var v = this.v;
        var w = this.t;
        var x = v[0];
        var y = v[1];
        var z = v[2];
        var s = 2.0 / this.quadrance();
        var xs = x * s;
        var ys = y * s;
        var zs = z * s;
        var wx = w * xs;
        var wy = w * ys;
        var wz = w * zs;
        var xx = x * xs;
        var xy = x * ys;
        var xz = x * zs;
        var yy = y * ys;
        var yz = y * zs;
        var zz = z * zs;

        if (matrix.dim[0] === 4 && matrix.dim[1] === 4) {

            matrix[0] = 1 - (yy + zz);
            matrix[1] = xy - wz;
            matrix[2] = xz + wy;
            matrix[3] = 0;
            matrix[4] = xy + wz;
            matrix[5] = 1 - (xx + zz);
            matrix[6] = yz - wx;
            matrix[7] = 0;
            matrix[8] = xz - wy;
            matrix[9] = yz + wx;
            matrix[10] = 1 - (xx + yy);
            matrix[11] = 0;
            matrix[12] = 0;
            matrix[13] = 0;
            matrix[14] = 0;
            matrix[15] = 1;

        } else if (matrix.dim[0] === 3 && matrix.dim[1] === 3) {
            matrix[0] = 1 - (yy + zz);
            matrix[1] = xy + wz;
            matrix[2] = xz - wy;
            matrix[3] = xy - wz;
            matrix[4] = 1 - (xx + zz);
            matrix[5] = yz + wx;
            matrix[6] = xz + wy;
            matrix[7] = yz - wx;
            matrix[8] = 1 - (xx + yy);

        } else {
            var msg = 'Quaternion.prototype.toMatrix argument must be undefined, a 3x3 matrix, ';
            msg += 'or a 4x4 matrix.';
            throw new DImensionError(msg);
        }

        return matrix;
    };

    /**
     * @name toTVArray
     * @memberof Quaternion.prototype
     * @function
     * @returns {Array} An array representation of this Quaternion with
     * coordinates in the folling order: [w, x, y, z].
     */
    Quaternion.prototype.toTVArray = function() {
        return [this.t, this.v[0], this.v[1], this.v[2]];
    };

    /**
     * @name toVTArray
     * @memberof Quaternion.prototype
     * @function
     * @returns {Array} An array representation of this Quaternion with
     * coordinates in the following order: [x, y, z, w].
     */
    Quaternion.prototype.toVTArray = function() {
        return [this.v[0], this.v[1], this.v[2], this.t];
    };

    /**
     * @name toString
     * @memberof Quaternion.prototype
     * @function
     * @returns {string} A string representation of this Quaternion.
     */
    Quaternion.prototype.toString = function() {
        return 'r: ' + this.t + ', i: [ ' + this.v[0] + ', ' + this.v[1] + ', ' + this.v[2] + ' ]';
    };

    Quaternion.prototype.toThreejs = function() {
        return new THREE.Quaternion(this.v[0], this.v[1], this.v[2], this.t);
    };

    /**
     * Attitude type.
     * Provides yaw, pitch, and roll attitude rotations.
     * Uses a quaternion and an orthogonal 3x3 matrix under the hood.
     *
     * @name Attitude
     * @class
     * @extends Dimensional
     */
    function Attitude() {
        this.dim = new Dimensions([3]);
        // lateral axis basis
        this[0] = new Vector([1, 0, 0]);
        // normal axis basis
        this[1] = new Vector([0, 1, 0]);
        // longitudinal axis basis
        this[2] = new Vector([0, 0, 1]);

        /**
         * A quaternion representing the orientation of this Attitude.
         *
         * @name orientation
         * @memberof Attitude
         * @instance
         */
        this.orientation = new Quaternion();

        /**
         * The cross Vector.
         *
         * @name cross
         * @memberof Attitude
         * @instance
         */
        Object.defineProperty(this, 'cross', {
            get: function() {
                return this[0];
            },
            set: function(vec) {
                this[0] = vec;
            }
        });

        /**
         * The up Vector.
         *
         * @name up
         * @memberof Attitude
         * @instance
         */
        Object.defineProperty(this, 'up', {
            get: function() {
                return this[1];
            },
            set: function(vec) {
                this[1] = vec;
            }
        });

        /**
         * The look Vector
         *
         * @name look
         * @memberof Attitude
         * @instance
         */
        Object.defineProperty(this, 'look', {
            get: function() {
                return this[2];
            },
            set: function(vec) {
                this[2] = vec;
            }
        });
    }
    Attitude.prototype = Object.create(Dimensional.prototype);
    Attitude.prototype.constructor = Attitude;
    Attitude.rotator = new Quaternion();

    /**
     * @name toMatrix
     * @memberof Attitude
     * @function
     * @throws {DimensionError} if matrix argument is not a 3x3 Matrix, a 4x4
     * Matrix, or undefined.
     * @param {Attitude} attitude - The Attitude.
     * @param {Matrix} [matrix] - the Matrix to be set as a rotation-matrix
     * representation of attitude. If undefined, creates a new Matrix.
     * @returns {Matrix} - The matrix.
     */
    Attitude.toMatrix = function(attitude, matrix) {
        if (typeof matrix === 'undefined') {
            matrix = new Matrix();
        }
        matrix.identity();
        var c = attitude.cross;
        var u = attitude.up;
        var l = attitude.look;

        if (matrix.dim[0] === 3 && matrix.dim[1] === 3) {
            matrix[0] = c[0];
            matrix[1] = c[1];
            matrix[2] = c[2];
            matrix[3] = u[0];
            matrix[4] = u[1];
            matrix[5] = u[2];
            matrix[6] = l[0];
            matrix[7] = l[1];
            matrix[8] = l[2];
        } else if (matrix.dim[0] === 4 && matrix.dim[1] === 4) {
            matrix[0] = c[0];
            matrix[1] = c[1];
            matrix[2] = c[2];
            matrix[4] = u[0];
            matrix[5] = u[1];
            matrix[6] = u[2];
            matrix[8] = l[0];
            matrix[9] = l[1];
            matrix[10] = l[2];
        } else {
            var msg = 'Attitude.toMatrix matrix argument must be undefined or a 3x3 or 4x4 Matrix.';
            throw new DimensionsEror(msg);
        }

        return matrix;
    };

    /**
     * Rotates this Attitude around its cross axis by theta.
     *
     * @name pitch
     * @memberof Attitude.prototype
     * @function
     * @param {number} theta - The angle of rotation.
     * @returns {Attitude} This Attitude.
     */
    Attitude.prototype.pitch = function(theta) {
        var rotator = Attitude.rotator;
        rotator.setAxisAngle(this[0], -theta);
        rotator.rotate(this[1]);
        rotator.rotate(this[2]);
        rotator.setAxisAngle(this[0], theta);
        this.orientation.mul(rotator);
        return this;
    }

    /**
     * Rotates this Attitude around its up axis by theta.
     *
     * @name yaw
     * @memberof Attitude.prototype
     * @function
     * @param {number} theta - The angle or rotation.
     * @returns {Attitude} This Attitude.
     */
    Attitude.prototype.yaw = function(theta) {
        var rotator = Attitude.rotator;
        rotator.setAxisAngle(this[1], -theta);
        rotator.rotate(this[0]);
        rotator.rotate(this[2]);
        rotator.setAxisAngle(this[1], theta);
        this.orientation.mul(rotator);
        return this;
    }

    /**
     * Rotates this Attitude around its look axis by theta.
     *
     * @name roll
     * @memberof Attitude.prototype
     * @function
     * @param {number} theta - The angle of rotation.
     * @returns {Attitude} This Attitude.
     */
    Attitude.prototype.roll = function(theta) {
        var rotator = Attitude.rotator;
        rotator.setAxisAngle(this[2], -theta);
        rotator.rotate(this[0]);
        rotator.rotate(this[1]);
        rotator.setAxisAngle(this[2], theta);
        this.orientation.mul(rotator);
        return this;
    }

    /**
     * @name toMatrix
     * @memberof Attitude.prototype
     * @function
     * @throws {ReferenceError} if matrix argument is undefined.
     * @throws {DimensionError} if matrix argument is not a 3x3 Matrix or a 4x4
     * Matrix.
     * @param {Matrix} matrix - The Matrix to set as a rotation-matrix
     * representation of this Attitude.
     * @returns {Matrix} The Matrix.
     */
    Attitude.prototype.toMatrix = function(matrix) {
        if (typeof Matrix === 'undefined') {
            var msg = 'Attitude.prototype.toMatrix matrix argument must be defined. ';
            msg += 'to create a new Matrix from this attitude use Attitude.toMatrix instead.';
            throw new ReferenceError(msg);
        }
        return Attitude.toMatrix(this, matrix);
    };

    /**
     * @name rotate
     * @memberof Attitude.prototype
     * @function
     * @throws {ReferenceError} if matrix argument is undefined.
     * @param {Matrix} matrix - The Matrix to rotate by this Attitude
     * @returns {matrix} The matrix.
     */
    Attitude.prototype.rotate = function(matrix) {
        var cache = Matrix.cache2;
        cache.dim[0] = matrix.dim[0];
        cache.dim[1] = matrix.dim[1];
        this.toMatrix(cache);

        return matrix.mul(cache);
    };

    /**
     * @name toString
     * @memberof Attitude.prototype
     * @function
     * @returns {string} A string representation of this Attitude.
     */
    Attitude.prototype.toString = function() {
        return this.cross.toString() + "\n " + this.up.toString() + "\n " + this.look.toString();
    };

    /**
     * @name DimensionError
     * @class
     * @extends Error
     * @param {string} message - The message property of this DimensionError.
     */
    /**
     * @name DimensionError^2
     * @class
     * @extends Error
     * @param {Array | number} obj1 - The first object with mismatched dimensions.
     * @param {Array | number} obj2 - The second object with mismatched dimensions.
     */
    function DimensionError(obj1, obj2) {
        if (typeof obj1 === 'string') {
            this.message = obj1;
            this.dims = new Dimensions([null]);
        } else {
            var t1 = obj1.constructor.name;
            var t2 = obj2.constructor.name;
            var d1;

            var d2;
            if (obj1.dim != null) {
                d1 = obj1.dim;
            } else if (obj1 instanceof Array) {
                d1 = obj1.length;
            } else if (typeof obj1 === 'number') {
                d1 = 1;
            } else {
                d1 = [null];
            }

            if (obj2.dim != null) {
                d2 = obj2.dim;
            } else if (obj2 instanceof Array) {
                d2 = obj2.length;
            } else if (typeof obj2 === 'number') {
                d2 = 1;
            } else {
                d2 = [null];
            }

            this.dims = [new Dimensions(d1), new Dimensions(d2)];
            this.dims.equals = function(array) {
                return this[0].equals(array[0]) && this[1].equals(array[1]);
            };

            if (this.dims[0][0] === null) {
                d1 = 'null';
            }
            if (this.dims[1][0] === null) {
                d2 = 'null';
            }

            this.message = 'Dimension mismatch: dim(' + t1 + ') = ' + d1 + '; dim(' + t2 + ') = ' + d2;
        }
    }
    DimensionError.prototype = Object.create(Error.prototype);
    DimensionError.prototype.constructor = DimensionError;
}());

var Vector = xform.Vector;
var Matrix = xform.Matrix;
var Quaternion = xform.Quaternion;