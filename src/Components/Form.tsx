import styles from "./Form.module.css";

export const Form = () => {
  return (
    <form className={styles.content}>
      <header>
        <h1>Login</h1>
      </header>

      <div className={styles.contentInput}>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" name="email" />
      </div>

      <div className={styles.contentInput}>
        <label htmlFor="email">Password</label>
        <input id="password" type="password" name="password" />
      </div>

      <footer>
        <button id="btnLogin" type="submit" name="btnLogin">
          Login
        </button>
      </footer>
    </form>
  );
};
