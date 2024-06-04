import { ToastOptions, toast } from 'react-toastify'
import { ToastProps } from '../interfaces'
import '../styles/toast.css'

const Toast = ({ type, message }: ToastProps) => {
    const level = type.toLowerCase()
    const dynamic: keyof typeof toast = level

    const props: ToastOptions = {
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

    if (level in toast) toast[dynamic as keyof typeof toast](message, { ...props })
}

export default Toast