export default function AccountNotActiveBanner() {
  return (
    <div className="w-full  bg-yellow-100 border-b border-yellow-300 text-yellow-900 px-6 py-3 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-semibold">
          Your account hasn't been approved yet
        </span>
        <span className="text-sm opacity-80">
          You will be able to fully manage your fleet once your account is
          approved.
        </span>
      </div>
    </div>
  );
}
