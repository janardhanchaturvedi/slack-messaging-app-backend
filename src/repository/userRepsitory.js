import User from '../schema/user.js';
import crudRespository from './crudRepository.js';
const userRespository = {
  ...crudRespository(User),
  getByEmail: async function (email) {
    const user = await User.findOne({ email });
    return user;
  },
  getByUsername: async function (username) {
    const user = await User.findOne({ username }).select('-password');
    return user;
  }
};
export default userRespository;
