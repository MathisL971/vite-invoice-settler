import { Alert } from "flowbite-react";
import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

type Props = {
  theme: "failure" | "success" | "warning";
  message: string;
  code?: number;
};

const ErrorAlert = (props: Props) => {
  const { lang } = useContext(LanguageContext);

  return (
    <Alert color={props.theme} className="w-full flex flex-row justify-center max-w-xl text-center m-auto">
      <div className="flex flex-col gap-3 justify-between items-center p-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={120}
          height={120}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        {
          props.code && (
            <span className="text-5xl font-extrabold">
              {props.code}
            </span>
          )
        }
        <span className="text-2xl font-bold">
          {lang === "fr" ? "Une erreur s'est produite" : "An error occurred"}
        </span>
        <span className="text-lg">
          <i>{props.message}</i>
        </span>
      </div>
    </Alert>
  );
};

export default ErrorAlert;
