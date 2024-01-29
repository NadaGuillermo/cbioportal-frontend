import * as React from 'react';
import * as _ from 'lodash';
import { Modal, Button } from 'react-bootstrap';
import { ITherapyRecommendation } from 'cbioportal-utils';
import Select from 'react-select';
import { DiscreteCopyNumberData, Mutation } from 'cbioportal-ts-api-client';
import { VariantAnnotation, MyVariantInfo } from 'genome-nexus-ts-api-client';
import {
    DefaultTooltip,
    placeArrowBottomLeft,
} from 'cbioportal-frontend-commons';
import styles from '../style/therapyRecommendation.module.scss';

interface ITherapyRecommendationFormOtherMtbProps {
    show: boolean;
    patientID: string;
    fhirsparkResult?: ITherapyRecommendation[];
    title: string;
    userEmailAddress: string;
    mutations: Mutation[];
    cna: DiscreteCopyNumberData[];
    indexedVariantAnnotations:
        | { [genomicLocation: string]: VariantAnnotation }
        | undefined;
    indexedMyVariantInfoAnnotations:
        | { [genomicLocation: string]: MyVariantInfo }
        | undefined;
    onHide: (
        newTherapyRecommendation?:
            | ITherapyRecommendation
            | ITherapyRecommendation[]
    ) => void;
}

export default class TherapyRecommendationFormOtherMtb extends React.Component<
    ITherapyRecommendationFormOtherMtbProps,
    {}
> {
    private formatDate(d: Date) {
        return (
            ('0' + d.getDate()).slice(-2) +
            '.' +
            ('0' + (d.getMonth() + 1)).slice(-2) +
            '.' +
            d.getFullYear()
        );
    }

    public render() {
        let selectedTherapyRecommendation: ITherapyRecommendation;
        if (
            this.props.fhirsparkResult == null ||
            this.props.fhirsparkResult.length == 0
        ) {
            return (
                <Modal
                    show={this.props.show}
                    onHide={() => {
                        this.props.onHide(undefined);
                    }}
                    backdrop={'static'}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Did not find any matching recommendation templates.
                    </Modal.Body>
                </Modal>
            );
        } else {
            const groupStyles = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 18,
            };
            const groupBadgeStyles = {
                backgroundColor: '#EBECF0',
                borderRadius: '2em',
                color: '#172B4D',
                display: 'inline-block',
                fontSize: 12,
                lineHeight: '1',
                minWidth: 1,
                padding: '0.16666666666667em 0.5em',
            };

            const filterOptions = (
                candidate: { label: any; value: any },
                input: string
            ) => {
                let searchString = input.toLowerCase();

                // default search
                if (
                    candidate.label.props.children[0]
                        .toLowerCase()
                        .includes(searchString)
                )
                    return true;

                return false;
            };

            return (
                <Modal
                    show={this.props.show}
                    onHide={() => {
                        this.props.onHide(undefined);
                    }}
                    backdrop={'static'}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form">
                            <div className="form-group">
                                <h5>Select entry from template:</h5>
                                <Select
                                    filterOption={filterOptions}
                                    options={this.props.fhirsparkResult.map(
                                        result => ({
                                            label: (
                                                <>
                                                    {result.treatments
                                                        .map(t => {
                                                            return t.name;
                                                        })
                                                        .join(' + ') +
                                                        ' (' +
                                                        result.reasoning.geneticAlterations
                                                            ?.map(g => {
                                                                return (
                                                                    g.hugoSymbol +
                                                                    ' ' +
                                                                    g.alteration
                                                                );
                                                            })
                                                            .join(', ') +
                                                        ') - ' +
                                                        result.evidenceLevel +
                                                        (result.evidenceLevelExtension &&
                                                        result.evidenceLevelExtension.toString() !==
                                                            'null'
                                                            ? ' ' +
                                                              result.evidenceLevelExtension +
                                                              (result.evidenceLevelM3Text &&
                                                              result.evidenceLevelM3Text !==
                                                                  'null'
                                                                  ? ' ' +
                                                                    result.evidenceLevelM3Text
                                                                  : '')
                                                            : '')}
                                                    &nbsp;
                                                    <DefaultTooltip
                                                        placement="bottomLeft"
                                                        trigger={[
                                                            'hover',
                                                            'focus',
                                                        ]}
                                                        overlay={
                                                            <div
                                                                className={
                                                                    styles.tooltip
                                                                }
                                                                style={{
                                                                    width:
                                                                        '120px',
                                                                }}
                                                            >
                                                                <span>
                                                                    Authored by{' '}
                                                                    {
                                                                        result.author
                                                                    }{' '}
                                                                    on{' '}
                                                                    {this.formatDate(
                                                                        new Date(
                                                                            +result.id
                                                                        )
                                                                    )}
                                                                    .
                                                                </span>
                                                            </div>
                                                        }
                                                        destroyTooltipOnHide={
                                                            false
                                                        }
                                                        onPopupAlign={
                                                            placeArrowBottomLeft
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                'fa fa-info-circle ' +
                                                                styles.icon
                                                            }
                                                            style={{
                                                                marginRight: 2,
                                                            }}
                                                        ></i>
                                                    </DefaultTooltip>
                                                </>
                                            ),
                                            value: result,
                                        })
                                    )}
                                    name="oncoKBResult"
                                    className="basic-select"
                                    classNamePrefix="select"
                                    onChange={(selectedOption: {
                                        label: string;
                                        value: ITherapyRecommendation;
                                    }) => {
                                        selectedTherapyRecommendation =
                                            selectedOption.value;
                                    }}
                                    formatGroupLabel={(data: any) => (
                                        <div style={groupStyles}>
                                            <span>{data.label}</span>
                                            <span style={groupBadgeStyles}>
                                                {data.options.length}
                                            </span>
                                        </div>
                                    )}
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="button"
                            bsStyle="default"
                            onClick={() => {
                                this.props.onHide(undefined);
                            }}
                        >
                            Dismiss
                        </Button>
                        <Button
                            type="button"
                            bsStyle="primary"
                            onClick={() => {
                                this.props.onHide(
                                    selectedTherapyRecommendation
                                );
                            }}
                        >
                            Add entry
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        }
    }
}
