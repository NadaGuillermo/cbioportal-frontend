import React from 'react';
import Timeline from './components/patientTimeline';
import { HealthStateChartDemo } from './components/HealthStateChartDemo';
import SampleManager from 'pages/patientView/SampleManager';
import { PatientViewPageInner } from 'pages/patientView/PatientViewPage';
import PatientViewCnaDataStore from 'pages/patientView/copyNumberAlterations/PatientViewCnaDataStore'; // Import type if needed
// import { PatientViewPageStore } from 'pages/patientView/clinicalInformation/PatientViewPageStore';

import WindowStore from 'shared/components/window/WindowStore';
import TimelineWrapper from 'pages/patientView/timeline/TimelineWrapper'; // CNA Timeline from here

import { PatientViewPageStore } from 'pages/patientView/clinicalInformation/PatientViewPageStore';
import PatientViewMutationsDataStore from '../mutation/PatientViewMutationsDataStore';

interface PROMsProps {
    patientViewPageStore: PatientViewPageStore;
    sampleManager: any;
    dataStore: PatientViewMutationsDataStore;
}

const Proms = ({
    patientViewPageStore,
    sampleManager,
    dataStore,
}: PROMsProps) => {
    return (
        <div>
            <h2>Patient-Reported Outcome Measures</h2>
            <Timeline
                patientViewPageStore={patientViewPageStore}
                sampleManager={sampleManager}
                dataStore={dataStore}
            />
            <HealthStateChartDemo />
        </div>
    );
};

export default Proms;
