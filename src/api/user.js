import redis from 'redis';
import resource from 'resource-router-middleware';
import axios from 'axios';

export default ({ config, db }) => resource({
  id: 'user',
  create({ body }, res) {
    // Save user to db
    db.set("user", JSON.stringify(body), redis.print);
    // use fetch API to call 3rd part API
    axios.post('http://localhost:8080/api/mock', {
      username: body.username,
      email: body.email,
      userType: body.user_type
    })
    .then(res => {
      console.log('---------Data from 3rd part API---------');
      console.log(res.data);
    })
    res.json(body);
  }
});