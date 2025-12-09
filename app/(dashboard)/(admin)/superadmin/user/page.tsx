import UserList from "@/components/UserList";

export default function OperatorPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <UserList />
          </div>
        </main>
      </div>
    </div>
  );
}
