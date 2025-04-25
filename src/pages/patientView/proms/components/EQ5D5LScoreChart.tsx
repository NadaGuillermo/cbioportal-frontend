import React from 'react';
import { VictoryChart, VictoryTheme, VictoryPie } from 'victory';

// Vorlage pie chart in shared/components/plots/ speichern (Wiederverwendbarkeit), Chart Library = Victory

export const PieChart = () => {
    return (
        <VictoryChart>
            <VictoryPie
                innerRadius={50}
                data={[
                    { x: 'Cats', y: 30 },
                    { x: 'Dogs', y: 35 },
                    { x: 'Birds', y: 25 },
                    { x: 'Rabbits', y: 10 },
                ]}
                theme={VictoryTheme.clean}
            />
        </VictoryChart>
    );
};
