const _ = require('lodash');
const math = require('mathjs');

const SOBEL_KERNEL_X = [[1, 0, -1], [2, 0, -2], [1, 0, -1]];
const SOBEL_KERNEL_Y = [[1, 2, 1], [0, 0, 0], [-1, -2, -1]];

module.exports = {
    convolute2D(matrix, kernel) {
        const kernelSize = math.size(kernel);
        const yOffset = Math.floor(kernelSize[0] / 2);
        const xOffset = Math.floor(kernelSize[1] / 2);

        const size = math.size(matrix);
        const ySize = size[0];
        const xSize = size[1];
        const resultMatrix = math.zeros(size);

        let paddedMatrix = math.zeros([ySize + yOffset*2, xSize + xOffset*2]);
        for (let i = -yOffset; i < ySize + yOffset; i++) {
            const rowNum = _.clamp(i, 0, ySize-1);
            const matrixRow = math.subset(matrix, math.index(rowNum, math.range(0, xSize)));
            const prePadding = Array(xOffset).fill(matrixRow[0][0]);
            const postPadding = Array(xOffset).fill(matrixRow[0][xSize - 1]);

            paddedMatrix = math.subset(paddedMatrix, math.index(i + yOffset, math.range(0, xSize + 2*xOffset)), [...prePadding, ...matrixRow[0], ...postPadding]);
        }


        for (let y = yOffset; y < ySize + yOffset; y++) {
            for (let x = xOffset; x < xSize + xOffset; x++) {
                const part = math.subset(paddedMatrix, math.index(math.range(y - yOffset, y + yOffset, true), math.range(x - xOffset, x + xOffset, true)));
                resultMatrix[y-yOffset][x-xOffset] = math.sum(math.multiply(part, kernel));
            }
        }

        return resultMatrix;
    },

    applySobel(matrix) {
        const sobelX = this.convolute2D(matrix, SOBEL_KERNEL_X);
        const sobelY = this.convolute2D(matrix, SOBEL_KERNEL_Y);

        return math.sqrt(math.add(math.square(sobelX), math.square(sobelY)));
    }
};
