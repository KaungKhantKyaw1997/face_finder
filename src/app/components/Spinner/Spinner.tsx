import Image from "next/image";
import styles from "./styles.module.css";

const Spinner = () => {
  return (
    <div className={styles.glass}>
      <div className={styles.spinner}>
        <Image
          className={styles.image}
          src="/face.svg"
          alt="Face"
          width={56}
          height={56}
        />
      </div>
    </div>
  );
};

export default Spinner;
