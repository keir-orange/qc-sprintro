import moment from "moment/moment";
import defaults from "lodash/fp/defaults";
import uniqid from "uniqid";

export default class ColumnItem {
    constructor(options) {
        const defaultOptions = {
            id: uniqid('column-item-'),
            dateCreated: moment().format(),
            userCreated: null,
            description: '',
            votes: {
                voteCount: 0,
                users: [],
            }
        };
        const overRideDefaults = defaults(defaultOptions)(options);
        Object.assign(this, overRideDefaults);
    }
};