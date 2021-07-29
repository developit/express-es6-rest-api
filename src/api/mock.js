import redis from 'redis';
import resource from 'resource-router-middleware';
import users from '../models/users';
import axios from 'axios';

export default ({ config, db }) => resource({
  id: 'mock',
  create({ body }, res) {
    // Save user to db
    db.get("user", (err, user) => {
      if(err) {
        res.error(err);
      }
      res.json(user);
    })
  }
});