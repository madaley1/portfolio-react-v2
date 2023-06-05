export default function Login() {
  return (
    <div id="login">
      <h1>The Login</h1>
      <form action="/api/login" method="get">
        <label>username</label>
        <input type="text" />

        <label>password</label>
        <input type="password" />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}