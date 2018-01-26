import defaults from 'lodash/fp/defaults';
import moment from 'moment';
import uniqid from 'uniqid';

export default class SprintRetrospective {
  constructor(options) {
      const defaultOptions = {
          id: uniqid('sprint-retro-'),
          dateCreated: moment().format(),
          userCreated: null,
          columns: [
              new Column({ columnName: 'Good'}),
              new Column({ columnName: 'Bad' }),
              new Column({ columnName: 'Needs Improvement' }),
          ],
          retrospectiveName: '',
          users: [],
          votesAllowed: 1,
          anonymousSession: true,
      };
      const overRideDefaults = defaults(defaultOptions)(options);
      Object.assign(this, overRideDefaults);
  }
};
