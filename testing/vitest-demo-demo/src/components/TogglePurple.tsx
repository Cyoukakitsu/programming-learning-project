function TogglePurple({
  isPurple,
  setIsPurple,
}: {
  isPurple: boolean;
  setIsPurple: (isPurple: boolean) => void;
}) {
  return (
    <label>
      Purple
      <input
        type="checkbox"
        checked={isPurple}
        onChange={() => setIsPurple(!isPurple)}
      />
    </label>
  );
}

export default TogglePurple;
