/* structures */

// structure of a singel data point
export interface Datum {
    x: number | string;
    y: number | null;
    y0?: number;
    labelName?: string; // used only for tooltip, will be dynamically filled with content
}

// structure of input data object: identifier, x/y points
export interface DataSet {
    [key: string]: Datum[];
}

// structure of range data
export interface Range {
    name?: string;
    range: [number, number];
}

export interface DataPair {
    x: string;
    y: number;
}

/* Helper functions */

// functions that returns the smallest and largest x values (used for computing the standard range area plot)
const getXDomain = (
    dataSet: DataSet
): {
    minX: Datum['x'] | null;
    maxX: Datum['x'] | null;
} => {
    const allX: Datum['x'][] = [];

    for (const series of Object.values(dataSet)) {
        for (const { x } of series) {
            allX.push(x);
        }
    }

    if (allX.length === 0) return { minX: null, maxX: null };

    // Normalize to sortable numbers
    const xWithSortKeys = allX.map(originalX => {
        let key: number;

        if (typeof originalX === 'number') {
            key = originalX;
        } else if (typeof originalX === 'string') {
            key = new Date(originalX).getTime(); // fallback for ISO strings
        } else {
        /*else if (originalX instanceof Date) {
            key = originalX.getTime();
        } */
            throw new Error('Unsupported x type');
        }

        return { originalX, key };
    });

    // Sort by key
    xWithSortKeys.sort((a, b) => a.key - b.key);

    return {
        minX: xWithSortKeys[0].originalX,
        maxX: xWithSortKeys[xWithSortKeys.length - 1].originalX,
    };
};

const getNormalizedValue = (y: number, maxY: number, minY: number): number => {
    if (y < 0) {
        return 0;
    }
    return (y - minY) / (maxY - minY);
};

/* function that merges two arrays where the values of the second are added after a specific position, 
thus the output looks like [first part of first array, second array, remaining of first array]*/
export const mergeArrays = (
    array1: any[],
    array2: any[],
    insertPosition: number
): any[] => {
    const arr1 = array1;
    const arr2 = array2;
    const position = insertPosition;

    if (position < 0 || position === null || position === undefined) return [];
    let result = [];

    // if position greater than length of arr1, concate arr2 to arr1 regardless of concrete position
    if (position > arr1.length - 1) {
        for (let i = 0; i < arr1.length + arr2.length; i++) {
            result[i] = i < arr1.length ? arr1[i] : arr2[i - arr1.length];
        }
        return result;
    }

    // add first part of first array
    for (let i = 0; i < position; i++) {
        result[i] = arr1[i];
    }
    // add second array
    for (let i = position; i < position + arr2.length; i++) {
        result[i] = arr2[i - position];
    }
    // add remaining part of first array
    for (let i = position + arr2.length; i < arr2.length + arr1.length; i++) {
        result[i] = arr1[i - arr2.length];
    }
    return result;
};

// function to display standard range in plot
export const createRangeData = (
    dataSet: DataSet,
    standardRange: Range
): DataSet => {
    const { minX, maxX } = getXDomain(dataSet);

    if (minX === null || maxX === null) return {};

    // if name given in standardRange, use this, otherwise a default name
    const name = standardRange.name ? standardRange.name : 'Standard Range';

    // create DataSet of two elements = four value pairs
    const result: DataSet = {
        [name]: [
            {
                x: minX,
                y: standardRange.range[1],
                y0: standardRange.range[0],
            },
            {
                x: maxX,
                y: standardRange.range[1],
                y0: standardRange.range[0],
            },
        ],
    };
    return result;
};

// normalize data
export const normalizeDataSet = (
    dataSet: Datum[],
    range: [number, number]
): Datum[] => {
    const [minY, maxY] = range;

    // If normalization not possible (max is 0 or max equals min), return original data.
    if (maxY === 0 || maxY === minY) {
        return dataSet;
    }

    // Normalize the y values
    return dataSet.map(datum => ({
        ...datum,
        y:
            typeof datum.y === 'number'
                ? getNormalizedValue(datum.y, maxY, minY) // normalization of positive values
                : null,
    }));
};

/* const transformNormalizedNumberToOriginal = (
    y: number | null,
    range: [number, number] | null
): number | null => {
    if (y === null) {
        return null;
    }
    if (range === null) {
        return y;
    }
    const [minY, maxY] = range;
    const result = y * (maxY - minY) + minY;

    // to prevent some numerical issues with VAS score
    if (result.toString().length > 5) {
        return Math.round(result);
    } else {
        return result;
    }
}; */

export const getOriginalY = (
    x: number | string,
    origData: Datum[]
): number | null => {
    for (let datum of origData) {
        if (datum.x === x) {
            return datum.y;
        }
    }
    return null;
};
