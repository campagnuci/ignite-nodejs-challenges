import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to show user profile", async () => {
    const id = (await createUserUseCase
      .execute({
        name: "Test User",
        email: "user@example.com",
        password: "123456",
      })
      .then((response) => response.id)) as string;

    const user = await showUserProfileUseCase.execute(id);

    expect(user).toHaveProperty("id");
    expect(user.name).toEqual("Test User");
  });

  it("should not be able to show profile of unexistent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("invalid_user_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
