import { Form } from "./components/Form";

import styles from "./App.module.css";
import { Link } from "react-router-dom";

export const App = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        <ul>
          <li>
            <Link to="/">Public Page</Link>
          </li>
          <li>
            <Link to="/Dashboard">Protected Page</Link>
          </li>
        </ul>
      </div>
      <Form />
      <div></div>
    </div>
  );
};
