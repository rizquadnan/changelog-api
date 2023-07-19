import request from "supertest"
import app from "../../server"

export const getTokenViaSignUp = async (args?: { username: string, password: string}) => {
  const { body } = await request(app)
    .post("/user")
    .send({
      username: args?.username ?? "adnan",
      password: args?.password ?? "admin",
    });
  const token = body.data.token as string
  return token
}

export const getTokenViaSignIn = async ({ username, password }: { username: string, password: string}) => {
  const { body } = await request(app).post("/sign_in").send({
    username,
    password,
  });
  const token = body.data.token as string;
  return token;
};