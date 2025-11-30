import { toast } from "sonner";

export async function handleSearch(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
): Promise<void> {
  e.preventDefault();
  toast.success("Search functionality is not implemented yet.");
}
