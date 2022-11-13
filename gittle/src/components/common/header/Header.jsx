import React from "react";
import { Link, useLocation } from "react-router-dom";
import GitPull from "./GitPull";
import styles from "./Header.module.css";
import TerminalButton from "./TerminalButton";

function Header() {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <div className={styles.container}>
      <h2>Gittle</h2>
      <div>
        <Link to="/">main</Link> | <Link to="/add">add</Link> |{" "}
        <Link to="/oauth">oauth</Link> | <Link to="/log">log</Link> |{" "}
        <Link to="/merge/ready">merge</Link> | <Link to="/push">push</Link> |{" "}
        <Link to="/merge/request">merge request</Link> | <Link to="/graph">graph</Link>
      </div>
      <TerminalButton />
      <GitPull />
    </div>
  );
}

export default Header;
