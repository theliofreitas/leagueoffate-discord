import mongoose from '../database/connection';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  summonerId: {
    type: String,
    required: true
  },
  summonerName: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', UserSchema);

export default User;