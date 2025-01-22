export default function LoadingSpinner({ size }: { size: string }) {
  return (
    <div className="flex justify-center items-center">
      <span className={`loading loading-spinner loading-${size}`}></span>
    </div>
  );
}
