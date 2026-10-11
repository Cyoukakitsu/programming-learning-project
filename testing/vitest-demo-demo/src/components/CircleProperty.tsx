function CircleProperty({
  children,
  property,
  setProperty,
}: {
  children: React.ReactNode;
  property: number;
  setProperty: (size: number) => void;
}) {
  return (
    <label>
      {children}
      <input
        type="number"
        value={property}
        onChange={(event) => setProperty(Number(event.target.value))}
      />
    </label>
  );
}

export default CircleProperty;
