const NODE_TYPE = {
    1: 'ELEMENT_NODE',
    2: 'ATTRIBUTE_NODE',
    3: 'TEXT_NODE',
    4: 'CDATA_SECTION_NODE',
    5: 'ENTITY_REFERENCE_NODE',
    6: 'ENTITY_NODE',
    7: 'PROCESSING_INSTRUCTION_NODE',
    8: 'COMMENT_NODE',
    9: 'DOCUMENT_NODE',
    10: 'DOCUMENT_TYPE_NODE',
    11: 'DOCUMENT_FRAGMENT_NODE',
    12: 'NOTATION_NODE'
}

/**
 * Check if argument is a HTML element 
 * @param {Object} value 
 * @return {Boolean}
 */
exports.node = function (value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
}
/**
 * Check if argument is a list of HTML elements.
 * 
 * @param {Object} value 
 * @return {Boolean}
 */
exports.nodeList = function (value) {
    var type = Object.prototype.toString.call(value);
    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]))
}
/**
 * Check if argument is a SVG element.
 * 
 * @param {Object} value 
 * @return {Boolean}
 */
exports.svg = function (value) {
    return value !== undefined
        && value instanceof SVGElement;
}
/**
 * Check if argument is string.
 * 
 * @param {Object} value 
 * @return {Boolean}
 */
exports.string = function (value) {
    return typeof value === 'string' || value instanceof String;
}
/**
 * Check if argument is a function.
 * 
 * @param {*} value 
 */
exports.fn = function (value) {
    var type = Object.prototype.toString.call(value);
    return type === '[object Function]'
}