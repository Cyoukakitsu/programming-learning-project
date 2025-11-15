export function Show(toast, summary = "", severity = "success", lift = 1000) {
  toast.current.show({
    severity,
    summary,
    lift,
  });
}
