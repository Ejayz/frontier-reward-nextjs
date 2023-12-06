export default async function login(email: string, password: string) {
  const response = await fetch("/api/private/authentication/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response;
}
