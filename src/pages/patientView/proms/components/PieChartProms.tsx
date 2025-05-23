import React, { useState, useMemo } from 'react';
import {
    VictoryChart,
    VictoryLine,
    VictoryScatter,
    VictoryAxis,
    VictoryLegend,
    VictoryTooltip,
    VictoryGroup,
    VictoryTheme,
    LineSegment,
    VictoryLabel,
    VictoryArea,
    VictoryVoronoiContainer,
    VictoryPie,
    VictoryContainer,
} from 'victory';

/* Interfaces for data format */

// structure of input data object
export interface DataPair {
    x: string;
    y: number;
}

// Props of PieChart
interface PieChartProps {
    data: DataPair;
    sideLength?: number;
    dataRange: [number, number];
}

/* Pre-defined constants*/

// colors
const colors = ['#dc3545', 'lightgray'];

// base layout constants
const TEXT_FONTSIZE = 8;
const LABEL_FONTSIZE = 3 * TEXT_FONTSIZE;

/* Plot logic */

const PieChart: React.FC<PieChartProps> = ({
    data,
    sideLength = 300,
    dataRange,
}) => {
    // viewBox path
    const viewBoxPath = '0 0 ' + sideLength + ' ' + sideLength;

    // Hook to memoize data, create array for pie chart data
    const useProcessedData = (
        data: DataPair,
        range: [number, number]
    ): DataPair[] => {
        return useMemo(() => {
            let newData: DataPair[] = [];

            newData[0] = data;
            newData[1] = { x: '', y: range[1] - data.y };

            return newData;
        }, [data, range]);
    };

    const processedData = useProcessedData(data, dataRange);

    // rendering
    return (
        <div
            className="container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <svg viewBox={viewBoxPath} width={sideLength} height={sideLength}>
                {/* Pie Chart */}
                <VictoryPie
                    theme={VictoryTheme.clean}
                    containerComponent={<VictoryContainer responsive={false} />}
                    standalone={false}
                    radius={sideLength / 6}
                    width={sideLength}
                    height={sideLength}
                    innerRadius={sideLength / 8}
                    labels={[]}
                    data={processedData}
                    colorScale={colors}
                    padAngle={3}
                />

                {/* Labels for name and value*/}
                {/* value in the middle of the doughnut chart*/}
                <VictoryLabel
                    textAnchor="middle"
                    style={{ fontSize: LABEL_FONTSIZE, fontWeight: 'bold' }}
                    x={sideLength / 2}
                    y={sideLength / 2}
                    text={data.y}
                />

                {/* name below chart */}
                <VictoryLabel
                    textAnchor="middle"
                    style={{ fontSize: LABEL_FONTSIZE }}
                    x={sideLength / 2}
                    y={sideLength - 2 * LABEL_FONTSIZE}
                    text={data.x}
                />
            </svg>
        </div>
    );
};

export default PieChart;
