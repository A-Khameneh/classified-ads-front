import styles from "./Loader.module.css";

export default function Loader() {
    return (
        <div className={styles.container}>
            <div className={styles.spinnerContainer}>
                <span className={styles.loader}></span>
            </div>
            <p className={styles.loaderText}>درخواست شما در حال پردازش است</p>
        </div>
    );
}