import { userModel, User } from "../models/userModel";

const getUserByEmailIdAndPassword = (email: string, password: string): User | null => {
  const user = userModel.findOne(email);
  if (user && user.password && isUserValid(user, password)) {
    return user;
  }
  return null;
};

const getUserById = (id: number): User | null => {
  return userModel.findById(id);
};

function isUserValid(user: User, password: string) {
  return user.password === password;
}

export { getUserByEmailIdAndPassword, getUserById };
