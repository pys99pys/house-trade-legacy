import { FC, ReactNode } from "react";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <header className={styles.header}>
        <h1>아파트 실거래가 조회</h1>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Layout;
