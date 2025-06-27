type UserPayload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
};

type userIn = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export { UserPayload, userIn };
