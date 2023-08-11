export default function loggedInCheck() {
  if (!process.env.NEXT_PUBLIC_ADMIN_KEY) return;
  if (
    sessionStorage.getItem('admin') &&
    sessionStorage.getItem('admin') === process.env.NEXT_PUBLIC_ADMIN_KEY
  ) {
    return true;
  } else {
    return false;
  }
}
