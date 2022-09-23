import { FormEvent, useState } from "react";
import styles from "./Form.module.css";

export const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    console.log({
      email,
      password,
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.content}>
      <header>
        <h1>Login</h1>
      </header>

      <div className={styles.contentInput}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.contentInput}>
        <label htmlFor="email">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <footer>
        <button id="btnLogin" type="submit" name="btnLogin">
          Login
        </button>
      </footer>
    </form>
  );
};
