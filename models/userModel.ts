type Role = "user" | "admin";

export interface User {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  role: Role;
  githubId?: string; // optional — for github logins
  avatar?: string;
  provider?: string;
}

let database: User[] = [
  { id: 1, name: "Jimmy Smith", email: "jimmy123@gmail.com", password: "jimmy123!", role: "admin" },
  { id: 2, name: "Johnny Doe", email: "johnny123@gmail.com", password: "johnny123!", role: "user" },
  { id: 3, name: "Jonathan Chen", email: "jonathan123@gmail.com", password: "jonathan123!", role: "user" },
];

let nextId = database.length + 1;

const userModel = {
  findOne: (email: string): User | null => {
    const user = database.find((u) => u.email === email);
    return user | null;
  },

  findById: (id: number): User | null => {
    const user = database.find((u) => u.id === id);
    return user | null;
  },

  findByGithubId: (githubId: string): User | null => {
    const user = database.find((u) => u.githubId === githubId);
    return user || null;
  },

  createFromGithubProfile: (profile: {
    id: string;
    displayName?: string;
    username?: string;
    photos?: { value?: string }[];
    emails?: { value?: string }[];
  }): User => {
    const newUser: User = {
      id: nextId++,
      name: profile.displayName || profile.username || `github-${profile.id}`,
      email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined,
      role: "user",
      githubId: profile.id,
      avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
      provider: "github",
    };
    database.push(newUser);
    return newUser;
  },

  // For convenience when testing / admin
  all: (): User[] => database,

};

export { database, userModel, User };
