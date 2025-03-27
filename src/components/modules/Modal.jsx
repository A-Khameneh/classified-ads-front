import { useEffect } from "react";

export default function Modal({ children, onClose }) {
    useEffect(() => {
        // اضافه کردن کلاس به body برای جلوگیری از اسکرول
        document.body.classList.add("overflow-hidden");
        
        // پاک کردن کلاس هنگام unmount شدن کامپوننت
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="fixed inset-0 bg-black bg-opacity-50" 
                onClick={onClose}
            ></div>
            <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-md mx-4">
                {children}
            </div>
        </div>
    );
}