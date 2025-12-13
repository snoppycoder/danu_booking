import { authAPI } from "@/app/api/api";

export async function onLogout(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
): Promise<void> {
  event.preventDefault();
  const response = await authAPI.logout();
  console.log(response);
}
