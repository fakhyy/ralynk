export function getFormValues<T>(e: React.SubmitEvent) {
  const formdata = new FormData(e.target);
  return Object.fromEntries(formdata.entries()) as T;
}