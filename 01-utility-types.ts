type User = {
  id: string;
  email: string;
  nickname: string;
  password: string;
};

type NewUser = Omit<User, "id">;

type UserResponse = Omit<User, "password">;
