import { ToastOptions, toast } from 'react-toastify'
import { ToastProps } from '../interfaces'
import '../styles/toast.css'

const Toast = ({ type, message,  }: ToastProps) => {
    const props: ToastOptions = {
        type: type,
        position: 'top-right',
        autoClose: 4000,
        className: 'toast',
        bodyClassName: 'toast-body',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: 'colored',
        draggable: true
    }

    if (type in toast) toast(message, { ...props })
}

export default Toast