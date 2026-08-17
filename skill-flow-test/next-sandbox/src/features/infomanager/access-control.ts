import type { PrototypeUser, ViewId } from "./types"

type HardcodedUser = PrototypeUser & {
  password: string
  allowedViews: "all" | ViewId[]
  homeView: ViewId
}

const hardcodedUsers: HardcodedUser[] = [
  {
    id: "user-admin",
    username: "admin",
    password: "infomanager",
    name: "Administrador Demo",
    initials: "AD",
    role: "admin",
    roleLabel: "Administrador",
    allowedViews: "all",
    homeView: "pos",
  },
  {
    id: "user-seller",
    username: "vendedor",
    password: "infomanager",
    name: "Vendedor Demo",
    initials: "VD",
    role: "seller",
    roleLabel: "Vendedor",
    allowedViews: ["pos", "articles"],
    homeView: "pos",
  },
]

function publicUser(user: HardcodedUser): PrototypeUser {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    initials: user.initials,
    role: user.role,
    roleLabel: user.roleLabel,
  }
}

export function authenticatePrototypeUser(
  username: string,
  password: string
): PrototypeUser | null {
  const normalizedUsername = username.trim().toLocaleLowerCase("es")
  const match = hardcodedUsers.find(
    (user) =>
      user.username.toLocaleLowerCase("es") === normalizedUsername &&
      user.password === password
  )

  return match ? publicUser(match) : null
}

export function canUserAccess(user: PrototypeUser, view: ViewId) {
  const record = hardcodedUsers.find((candidate) => candidate.id === user.id)
  return record?.allowedViews === "all" || Boolean(record?.allowedViews.includes(view))
}

export function getUserHomeView(user: PrototypeUser): ViewId {
  return hardcodedUsers.find((candidate) => candidate.id === user.id)?.homeView ?? "pos"
}

