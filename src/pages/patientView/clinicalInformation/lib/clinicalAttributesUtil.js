import * as $ from 'jquery';
import _ from 'underscore';
import * as React from 'react';
import * as styleConsts from './clinicalAttributesStyleConsts.ts';
import { isString } from 'lodash';
import { getServerConfig, ServerConfigHelpers } from 'config/config';

/**
 * Functions for dealing with clinical attributes.
 */
/**
 * Clean clinical attributes. Useful for rounding numbers, or other types of
 * data cleanup steps. Probably differs per institution.
 * @param {object} clinicalData - key/value pairs of clinical data
 */
function clean(clinicalData) {
    // Shallow Copy clinicalData
    const cleanClinicalData = $.extend({}, clinicalData);
    const NULL_VALUES = [
        'not applicable',
        'not available',
        'pending',
        'discrepancy',
        'completed',
        '',
        'null',
        'unknown',
        'na',
        'n/a',
        '[unkown]',
        '[not submitted]',
        '[not evaluated]',
        '[not applicable]',
        '[not available]',
        '[undefined]',
    ];

    const keys = Object.keys(clinicalData);
    for (let i = 0; i < keys.length; i += 1) {
        let value;
        const key = keys[i];

        value = clinicalData[key];

        // Remove null values
        if (NULL_VALUES.indexOf(value.toLowerCase()) > -1) {
            delete cleanClinicalData[key];
        } else {
            // Change values for certain attributes, e.g. rounding
            switch (key) {
                case 'OS_MONTHS':
                case 'DFS_MONTHS':
                case 'AGE':
                    if ($.isNumeric(value)) {
                        value = Math.floor(value);
                    }
                    cleanClinicalData[key] = value;
                    break;
                // remove prefix ("1:" or "0:") for OS_STATUS and DFS_STATUS
                case 'OS_STATUS':
                case 'DFS_STATUS':
                    if (value.match(/^(1|0):/)) {
                        value = value.replace(/^(1|0):/, '');
                        cleanClinicalData[key] = value;
                    }
                    break;
                default:
            }
        }
    }
    return cleanClinicalData;
}

/**
 * Get first key found in object. Otherwise return null.
 * @param {object} object - object with key/value pairs
 * @param {array} keys - array of keys
 */
function getFirstKeyFound(object, keys) {
    if (!object) {
        return null;
    }

    for (let i = 0; i < keys.length; i += 1) {
        const value = object[keys[i]];
        if (typeof value !== 'undefined' && value !== null) {
            return value;
        }
    }
    return null;
}

/**
 * Derive clinical attributes from existing clinical attributes .e.g. age based
 * on a date of birth. TODO: Now only includes a funky hack to keep current
 * derived clinical attributes working.
 * @param {object} clinicalData - key/value pairs of clinical data
 */
function derive(clinicalData) {
    const {
        customSampleTypes,
        customSampleTypesLower,
    } = ServerConfigHelpers.parseCustomSampleTypeColors(
        getServerConfig().skin_patient_view_custom_sample_type_colors_json
    );

    const derivedClinicalAttributes = $.extend({}, clinicalData);

    /**
     * TODO: Pretty funky function to get a normalized case type. This should
     * probably also be a clinical attribute with a restricted vocabulary. Once
     * the database has been changed to include normalized case types, this
     * function should be removed.
     * @param {object} clinicalData - key/value pairs of clinical data
     * @param {string} caseTypeAttrs - TUMOR_TYPE or SAMPLE_TYPE value to normalize
     */
    function normalizedCaseType(cData, caseTypeAttrs) {
        let caseTypeNormalized = null;
        let caseType;
        let caseTypeLower;
        let i;

        for (i = 0; i < caseTypeAttrs.length; i += 1) {
            caseType = cData[caseTypeAttrs[i]];

            if (caseType !== null && typeof caseType !== 'undefined') {
                caseTypeLower = caseType.toLowerCase();
                const foundCustomIndex = customSampleTypesLower.findIndex(
                    type => caseTypeLower.indexOf(type) >= 0
                );
                if (foundCustomIndex >= 0) {
                    caseTypeNormalized = customSampleTypes[foundCustomIndex];
                } else if (caseTypeLower.indexOf('metasta') >= 0) {
                    caseTypeNormalized = 'Metastasis';
                } else if (caseTypeLower.indexOf('recurr') >= 0) {
                    caseTypeNormalized = 'Recurrence';
                } else if (caseTypeLower.indexOf('progr') >= 0) {
                    caseTypeNormalized = 'Progressed';
                } else if (
                    caseTypeLower.indexOf('xeno') >= 0 ||
                    caseTypeLower.indexOf('pdx') >= 0
                ) {
                    caseTypeNormalized = 'Xenograft';
                } else if (caseTypeLower.indexOf('organoid') >= 0) {
                    caseTypeNormalized = 'Organoid';
                } else if (caseTypeLower.indexOf('cfdna') >= 0) {
                    caseTypeNormalized = 'cfDNA';
                } else if (caseTypeLower.indexOf('prim') >= 0) {
                    caseTypeNormalized = 'Primary';
                } else if (caseTypeLower.indexOf('ctdna') >= 0) {
                    caseTypeNormalized = 'ctDNA';
                } else if (caseTypeLower.indexOf('plasma') >= 0) {
                    caseTypeNormalized = 'Plasma';
                } else if (caseTypeLower.indexOf('urine') >= 0) {
                    caseTypeNormalized = 'Urine';
                } else if (caseTypeLower.indexOf('exosome') >= 0) {
                    caseTypeNormalized = 'Exosome';
                } else if (caseTypeLower.indexOf('total rna') >= 0) {
                    caseTypeNormalized = 'total RNA';
                } else if (caseTypeLower.indexOf('total dna') >= 0) {
                    caseTypeNormalized = 'total DNA';
                } else if (caseTypeLower.indexOf('tissue') >= 0) {
                    caseTypeNormalized = 'Tissue';
                }
                if (
                    caseTypeNormalized !== null &&
                    typeof caseTypeNormalized !== 'undefined'
                ) {
                    break;
                }
            }
        }

        return caseTypeNormalized;
    }

    const caseTypeNormalized = normalizedCaseType(clinicalData, [
        'SAMPLE_CLASS',
        'SAMPLE_TYPE',
        'TUMOR_TISSUE_SITE',
        'TUMOR_TYPE',
        'SAMPLE_TYPE_DETAILED',
    ]);
    if (caseTypeNormalized !== null) {
        let loc;

        derivedClinicalAttributes.DERIVED_NORMALIZED_CASE_TYPE = caseTypeNormalized;

        // TODO: DERIVED_SAMPLE_LOCATION should probably be a clinical attribute.
        if (
            derivedClinicalAttributes.DERIVED_NORMALIZED_CASE_TYPE ===
            'Metastasis'
        ) {
            loc = getFirstKeyFound(clinicalData, [
                'METASTATIC_SITE',
                'TUMOR_SITE',
            ]);
        } else if (
            derivedClinicalAttributes.DERIVED_NORMALIZED_CASE_TYPE === 'Primary'
        ) {
            loc = getFirstKeyFound(clinicalData, [
                'PRIMARY_SITE',
                'TUMOR_SITE',
            ]);
        } else {
            loc = getFirstKeyFound(clinicalData, ['TUMOR_SITE']);
        }
        if (loc !== null) {
            derivedClinicalAttributes.DERIVED_SAMPLE_LOCATION = loc;
        }
    }

    return derivedClinicalAttributes;
}

/**
 * Run both clean and derive on the clinicalData.
 */
function cleanAndDerive(clinicalData) {
    return derive(clean(clinicalData));
}

/**
 * Return string of spans representing the clinical attributes. The spans
 * have been made specifically to add clinical attribute information as
 * attributes to allow for easy styling with CSS.
 * @param {object} clinicalData     - key/value pairs of clinical data
 * @param {string} cancerStudyId    - short name of cancer study
 */
function getSpanElements(clinicalData) {
    return getSpanElementsFromCleanData(cleanAndDerive(clinicalData));
}

function parseIt(json) {
    return JSON.parse(json, function(key, value) {
        if (
            typeof value === 'string' &&
            value.startsWith('/Function(') &&
            value.endsWith(')/')
        ) {
            value = value.substring(10, value.length - 2);
            var string = value.slice(
                value.indexOf('(') + 1,
                value.indexOf(')')
            );
            if (/\S+/g.test(string)) {
                return new Function(
                    string,
                    value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'))
                );
            } else {
                return new Function(
                    value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'))
                );
            }
        }
        if (
            typeof value === 'string' &&
            value.startsWith('/String(') &&
            value.endsWith(')/')
        ) {
            value = value.substring(8, value.length - 2);
        }
        return value;
    });
}

function getSpanElementsFromCleanData(clinicalAttributesCleanDerived) {
    const config = styleConsts.config;
    try {
        fetch('/attributes.json').then(res =>
            res.text().then(t => Object.assign(config, parseIt(t)))
        );
    } catch (error) {
        console.log(error);
    }
    const sortedKeys = Object.keys(clinicalAttributesCleanDerived)
        .sort((a, b) => {
            return styleConsts.compare(a, b, config);
        })
        .filter(key => {
            return styleConsts.inConfig(key, config);
        });

    return sortedKeys.map(key => {
        let value = replaceArray(clinicalAttributesCleanDerived[key]);
        const [prefix, middle, suffix] = styleConsts.stringBuilder(
            value,
            key,
            config,
            sortedKeys
        );
        return (
            <span
                is
                style={{
                    color: styleConsts.calculateColor(value, key, config),
                }}
            >
                <span class="dark-comma">{prefix}</span>
                {middle}
                <span class="dark-comma">{suffix}</span>
            </span>
        );
    });
}

/*
 * Add .first-order class to all elements with the lowest order attribute.
 * This way the first element can be styled in a different manner. If flex
 * order attributes were working properly in CSS, one would be able to say
 * .clinical-attribute:first, this is unfortunately not the case, therefore
 * this hack is required (this is no longer used).
 */
function addFirstOrderClass() {
    $('.sample-record-inline, #more-patient-info').each(() => {
        const orderSortedAttributes = _.sortBy(
            $(this).find('a > .clinical-attribute'),
            y => {
                const order = parseInt($(y).css('order'), 10);
                if (isNaN(order)) {
                    console.log(
                        'Warning: No order attribute found in .clinical-attribute.'
                    );
                }
                return order;
            }
        );
        $(orderSortedAttributes[0]).addClass('first-order');
    });
}

const replaceArray = function(replaceString) {
    if (!isString(replaceString)) {
        return replaceString;
    }
    const search = ['Ã¤', 'Ã¼', 'Ã¶', 'Ã„', 'Ã–', 'Ãœ', 'ÃŸ'];
    const replace = ['ä', 'ü', 'ö', 'Ä', 'Ö', 'Ü', 'ß'];
    let regex;
    for (let i = 0; i < search.length; i++) {
        regex = new RegExp(search[i], 'g');
        replaceString = replaceString.replace(regex, replace[i]);
        replaceString.re;
    }
    return replaceString;
};

export {
    cleanAndDerive,
    getSpanElements,
    getSpanElementsFromCleanData,
    addFirstOrderClass,
};
