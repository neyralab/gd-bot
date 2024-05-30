import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button type="button" onClick={() => navigate(-1)} className={styles.btn}>
            Back
        </button>
    );
};
