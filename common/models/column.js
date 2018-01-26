import moment from "moment/moment";
import defaults from "lodash/fp/defaults";
import uniqid from "uniqid";

export default class Column {
    constructor(options) {
        const defaultOptions = {
            id: uniqid('column-'),
            dateCreated: moment().format(),
            columnName: '',
            columnItems: [],
        };
        // override the defaults with any properties passed to class
        const overRideDefaults = defaults(defaultOptions)(options);
        // assign properties to 'this'
        Object.assign(this, overRideDefaults);
    }
};
