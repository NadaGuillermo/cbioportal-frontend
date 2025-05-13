import React from 'react';
import Timeline from './components/patientTimeline';
import LineScatterPlot from './components/LineScatterPlotProms';
import {
    DataSet,
    Range,
    DataPair,
} from './components/helperFunctionsForPromCharts';
import PieChart from './components/PieChartProms';

import FontAwesome from 'react-fontawesome';

import SampleManager from 'pages/patientView/SampleManager';
import { PatientViewPageInner } from 'pages/patientView/PatientViewPage';
import PatientViewCnaDataStore from 'pages/patientView/copyNumberAlterations/PatientViewCnaDataStore'; // Import type if needed

import { PatientViewPageStore } from 'pages/patientView/clinicalInformation/PatientViewPageStore';
import PatientViewMutationsDataStore from '../mutation/PatientViewMutationsDataStore';
import {
    Grid,
    Row,
    Col,
    Clearfix,
    Tooltip,
    OverlayTrigger,
} from 'react-bootstrap';
//import ReactGridLayout  from 'react-grid-layout';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    DefaultTooltip,
    placeArrowBottomLeft,
} from 'cbioportal-frontend-commons';

// import styles from './promStyles.module.scss';
import './styles.scss';

interface PROMsProps {
    patientViewPageStore: PatientViewPageStore;
    sampleManager: any;
    dataStore: PatientViewMutationsDataStore;
}

const InfoTooltip = ({
    id,
    children,
    href,
    tooltip,
    placement,
}: {
    id: string;
    children: any;
    href: string;
    tooltip: any;
    placement: string;
}) => {
    /*  return (
        <OverlayTrigger
            overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
            delayShow={300}
            delayHide={150}
            placement={placement}
            >
            {children}
        </OverlayTrigger>
   
  ); */
    return (
        <DefaultTooltip
            placement={placement}
            trigger={['hover', 'focus', 'click']}
            overlay={tooltip}
            arrowContent={<div className="rc-tooltip-arrow-inner" />}
            destroyTooltipOnHide={true}
            //onPopupAlign={placeArrowBottomLeft}
        >
            {children}
        </DefaultTooltip>
    );
};

/* function to convert date to right format */
function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date
        .getFullYear()
        .toString()
        .slice(-2); // Get the last two digits of the year

    return `${day}/${month}/${year}`;
}

// meta data eq5d5l
// 5 Dimensions
const VALUES_ALPHA = ['Extreme', 'Severe', 'Moderate', 'Slight', 'No'];
const VALUES_NUMERIC = [1, 2, 3, 4, 5];
const VALUES_RANGE: [number, number] = [1, 5];
// EQ and VAS
const EQ_VALUES_NUMERIC = [0, 0.25, 0.5, 0.75, 1];
const EQ_RANGE: [number, number] = [0, 1];
const EQ_VALUES_ALPHA = [
    '(worst health) 0',
    '0.25',
    '0.5',
    '0.75',
    '(best health) 1',
];
const VAS_VALUES_NUMERIC = [0, 25, 50, 75, 100];
const VAS_RANGE: [number, number] = [0, 100];
const VAS_VALUES_ALPHA = [
    '0 (worst health)',
    '25',
    '50',
    '75',
    '100 (best health)',
];

/* Sample data sets */
const sampleData5Dimensions: DataSet = {
    Mobility: [
        { x: formatDate(new Date(2025, 0, 1)), y: 1 },
        { x: formatDate(new Date(2025, 1, 1)), y: 2 },
        { x: formatDate(new Date(2025, 2, 1)), y: 1 },
        { x: formatDate(new Date(2025, 3, 1)), y: 4 },
    ],
    'Self-Care': [
        { x: formatDate(new Date(2025, 0, 1)), y: 3 },
        { x: formatDate(new Date(2025, 1, 1)), y: 5 },
        { x: formatDate(new Date(2025, 2, 1)), y: 4 },
        { x: formatDate(new Date(2025, 3, 1)), y: 2 },
    ],
    'Usual activities': [
        { x: formatDate(new Date(2025, 0, 1)), y: 1 },
        { x: formatDate(new Date(2025, 1, 1)), y: 1 },
        { x: formatDate(new Date(2025, 2, 1)), y: 2 },
        { x: formatDate(new Date(2025, 3, 1)), y: 2 },
    ],
    'Pain/Discomfort': [
        { x: formatDate(new Date(2025, 0, 1)), y: 5 },
        { x: formatDate(new Date(2025, 1, 1)), y: 3 },
        { x: formatDate(new Date(2025, 2, 1)), y: 1 },
        { x: formatDate(new Date(2025, 3, 1)), y: 3 },
    ],
    'Anxiety/Dipression': [
        { x: formatDate(new Date(2025, 0, 1)), y: 2 },
        { x: formatDate(new Date(2025, 1, 1)), y: 2 },
        { x: formatDate(new Date(2025, 2, 1)), y: 2 },
        { x: formatDate(new Date(2025, 3, 1)), y: 1 },
    ],
    Average: [
        { x: formatDate(new Date(2025, 0, 1)), y: 2.3 },
        { x: formatDate(new Date(2025, 1, 1)), y: 3.5 },
        { x: formatDate(new Date(2025, 2, 1)), y: 1.7 },
        { x: formatDate(new Date(2025, 3, 1)), y: 2.8 },
    ],
};

const sampleDataEqVas: DataSet = {
    EQ: [
        { x: formatDate(new Date(2025, 0, 1)), y: 0.6 },
        { x: formatDate(new Date(2025, 1, 9)), y: 0.55 },
        { x: formatDate(new Date(2025, 2, 1)), y: -0.33 },
        { x: formatDate(new Date(2025, 12, 7)), y: 0.2 },
        // { x: formatDate(new Date(2026, 0, 1)), y: 0.6 },
        // { x: formatDate(new Date(2026, 1, 9)), y: 0.55 },
        // { x: formatDate(new Date(2026, 2, 1)), y: -0.33 },
        // { x: formatDate(new Date(2026, 12, 7)), y: 0.2 },
    ],
    VAS: [
        { x: formatDate(new Date(2025, 0, 1)), y: 30 },
        { x: formatDate(new Date(2025, 1, 9)), y: 45 },
        { x: formatDate(new Date(2025, 2, 1)), y: 73 },
        { x: formatDate(new Date(2025, 12, 7)), y: 55 },
        // { x: formatDate(new Date(2026, 0, 1)), y: 30 },
        // { x: formatDate(new Date(2026, 1, 9)), y: 45 },
        // { x: formatDate(new Date(2026, 2, 1)), y: 73 },
        // { x: formatDate(new Date(2026, 12, 7)), y: 55 },
    ],
};

const standardRange: Range = { name: 'Standard Range', range: [0.45, 0.7] };

const pieData: DataPair = { x: 'Index', y: 0.86 };
const pieData2: DataPair = { x: 'VAS', y: 80 };

const thresholdsEQ = [0.2, 0.4, 0.6, 0.8];
const currentDate = formatDate(new Date());
const questionnaireName = 'EQ-5D-5L';

const chartTitles = ['Current EQ-Score', 'Scores', 'Health State Detail'];

const eq5d5lInfo =
    'https://euroqol.org/information-and-support/euroqol-instruments/eq-5d-5l/';

const scoresDescription = 'Lorem ipsum Standard range toggle legend';
const healthDetailsDescription = 'Lorem ipsum dimensions toogle legend';
const currentEqVasDescription = 'Lorem ipsum eq and vas';

// TODO Funktion zum Herauslesen des aktuellen EQ- und VAS-Wertes für PieChart
// Bereich current EQ scores als eigene Komponente -> oberes dorthin auslagern?

/* pre-process given data */
// hook for processing data
const useProcesseData = (datasets: DataSet) => {
    // logic here

    return datasets;
};

const Proms = ({
    patientViewPageStore,
    sampleManager,
    dataStore,
}: PROMsProps) => {
    // process data before displaying it
    const processedData = useProcesseData(sampleData5Dimensions);

    return (
        <div className="proms">
            <h2>Patient-Reported Outcome Measures</h2>

            <div className="questionnaire-title">
                Questionnaire: {questionnaireName} (
                <a href={eq5d5lInfo} target="_blank" rel="opener">
                    Info
                </a>
                )
            </div>
            {/* <div className="container-fluid"> */}

            <Grid fluid>
                <Row className="prom-grid">
                    <Col md={12} lg={3}>
                        <div className="proms-container-small">
                            <div className="chart-heading-container-left">
                                <div className="chart-heading">
                                    {chartTitles[0]}
                                </div>
                                <InfoTooltip
                                    tooltip={currentEqVasDescription}
                                    href="#"
                                    id="currentEqVas"
                                    placement="right"
                                >
                                    <div className="icon-wrapper">
                                        <FontAwesome name="info-circle" />
                                    </div>
                                </InfoTooltip>
                            </div>
                            <p>Date: {currentDate}</p>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <PieChart
                                    data={pieData}
                                    dataRange={EQ_RANGE}
                                    thresholds={thresholdsEQ}
                                />
                                <PieChart
                                    data={pieData2}
                                    dataRange={VAS_RANGE}
                                />
                            </div>
                        </div>
                    </Col>

                    <Col md={12} lg={9}>
                        <div className="proms-container-large">
                            <div className="chart-heading-container-center">
                                <div className="chart-heading__capitalLettersCentered flex-width-container">
                                    {chartTitles[1]}
                                </div>
                                <InfoTooltip
                                    tooltip={scoresDescription}
                                    href="#"
                                    id="scores"
                                    placement="left"
                                >
                                    <div className="icon-wrapper-no-bot-margin">
                                        <FontAwesome name="info-circle" />
                                    </div>
                                </InfoTooltip>
                            </div>

                            {/* EQ vs VAS */}
                            <LineScatterPlot
                                data={sampleDataEqVas}
                                // width={800}
                                // height={400}
                                title="Scores"
                                xLabel="Date"
                                yLabel="EQ Index"
                                yTickFormat={EQ_VALUES_ALPHA}
                                yRange={EQ_RANGE}
                                secondYLabel="EQ VAS"
                                secondYTickFormat={VAS_VALUES_ALPHA}
                                secondYRange={VAS_RANGE}
                                standardRange={standardRange}
                                showTooltip={true}
                            />
                        </div>
                    </Col>
                </Row>

                <Row className="prom-grid">
                    <Col md={12} lg={9} lgOffset={3}>
                        <div className="proms-container-large">
                            <div className="chart-heading-container-center">
                                <div className="chart-heading__capitalLettersCentered flex-width-container">
                                    {chartTitles[2]}
                                </div>
                                <InfoTooltip
                                    tooltip={healthDetailsDescription}
                                    href="#"
                                    id="healthDetails"
                                    placement="left"
                                >
                                    <div className="icon-wrapper-no-bot-margin">
                                        <FontAwesome name="info-circle" />
                                    </div>
                                </InfoTooltip>
                            </div>
                            {/* 5 Dimensions */}
                            <LineScatterPlot
                                data={processedData}
                                // width={800}
                                // height={400}
                                title="Health State Detail"
                                xLabel="Date"
                                yLabel={'Problems'}
                                yTickFormat={VALUES_ALPHA}
                                yRange={VALUES_RANGE}
                                showTooltip={true}
                            />
                        </div>
                    </Col>
                </Row>
                <Row className="prom-grid">
                    <Col md={12} lg={9} lgOffset={3}>
                        <div className="proms-container-large">
                            <Timeline
                                patientViewPageStore={patientViewPageStore}
                                sampleManager={sampleManager}
                                dataStore={dataStore}
                            />
                        </div>
                    </Col>
                </Row>
            </Grid>
            {/* </div> */}
        </div>
    );
};

export default Proms;
