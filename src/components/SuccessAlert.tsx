import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

const SuccessAlert = () => {
  const { lang } = useContext(LanguageContext);

  return (
    <div
      className="bg-emerald-300 flex-grow w-full text-center font-bold p-4 rounded-md gap-2 flex flex-col"
    >
      <p className="text-emerald-900 text-sm sm:text-base md:text-lg lg:text-xl font-bold">
        {lang === "fr"
          ? "Votre paiement a été effectué avec succès "
          : "Your payment has been successfully processed "}
        <span role="img" aria-label="money">
          💸
        </span>
      </p>
    </div>
  );
};

export default SuccessAlert;
