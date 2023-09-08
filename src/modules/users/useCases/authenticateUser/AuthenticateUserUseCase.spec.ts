import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to authenticate an user", async () => {
    await createUserUseCase.execute({
      email: "user@example.com",
      name: "Test User",
      password: '123456',
    });

    const response = await authenticateUserUseCase.execute({
      email: "user@example.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able to authenticate unexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "invalid_user_email",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect credentials", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "user@example.com",
        name: "Test User",
        password: '123456',
      });

      await authenticateUserUseCase.execute({
        email: "user@example.com",
        password: "invalid_password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
