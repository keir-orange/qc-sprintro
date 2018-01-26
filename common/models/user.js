import moment from "moment/moment";
import defaults from "lodash/fp/defaults";
import uniqid from "uniqid";

export default class User {
    constructor(options) {
        const defaultOptions = {
            id: uniqid('user-'),
            dateCreated: moment().format(),
            email: '',
            userName: '',
            displayName: '',
        };
        const overRideDefaults = defaults(defaultOptions)(options);
        Object.assign(this, overRideDefaults);
    }
};