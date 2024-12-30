import { ToastContainer } from "react-toastify";

export const ToastProvider = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
            className="z-[9999]"
        />
    );
};
