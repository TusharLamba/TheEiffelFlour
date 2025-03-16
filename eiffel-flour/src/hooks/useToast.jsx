import { useState } from 'react';
import { toast, Bounce } from 'react-toastify';

import './useToast.scss';

const useToast = () => {

    const [toastList, setToastList] = useState([]);

    const defaultConfig = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        transition: Bounce
    };

    const notify = (type, msg, config = defaultConfig) => {
        const id = toast[type](msg, config);
        setToastList(prev => [...prev, id]);
    }

    const dismiss = (toastId) => {
        toast.dismiss(toastId);
        setToastList(prev => prev.filter(id => id !== toastId));
    }

    const dismissAll = () => {
        toast.dismiss();
        setToastList([]);
    }

    const update = (toastId, config) => {
        toast.update(toastId, config);
    }

    return { toastList, notify, dismiss, dismissAll, update };
};

export default useToast;