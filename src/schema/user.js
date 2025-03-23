import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        //eslint-disable-next-line
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Pleas fill a valid email address'
      ]
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username is already present'],
      match: [
        /[0-9]{6,15}[a-zA-Z]/,
        'Username must contain only letters and numbers'
      ]
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function saveUser(next) {
  const user = this;
  const SALT = bcrypt.genSaltSync(10);
  if (!user.isModified('password')) return next();
  const hashedPassword = bcrypt.hashSync(user.password, SALT);
  user.password = hashedPassword;
  user.avatar = `https://robohash.org/${user.username}`;
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
