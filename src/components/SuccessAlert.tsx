import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

const SuccessAlert = () => {
  const { lang } = useContext(LanguageContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        backgroundColor: "lightgreen",
        borderRadius: "10px",
        padding: "1rem 2rem",
        fontWeight: "bold",
        textAlign: "center",
        color: "darkgreen",
        width: "fit-content",
      }}
    >
      <h2>
        {lang === "fr"
          ? "Votre paiement a été effectué avec succès "
          : "Your payment has been successfully processed "}
        <span role="img" aria-label="money">
          💸
        </span>
      </h2>
    </div>
  );
};

export default SuccessAlert;
