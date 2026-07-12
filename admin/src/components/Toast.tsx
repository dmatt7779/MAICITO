import { ToastOptions, TypeOptions, toast } from 'react-toastify'
import { ToastProps } from '../interfaces'
import '../styles/toast.css'

// Mapea el "Level" del backend (success/warning/error/information) al tipo de
// react-toastify, que es quien define el COLOR del toast (theme "colored").
// Ojo: el backend usa "information" pero react-toastify espera "info".
const LEVEL_TO_TYPE: Record<string, TypeOptions> = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    information: 'info',
    info: 'info',
}

const Toast = ({ type, message }: ToastProps) => {
    if (!message) return

    const toastType: TypeOptions = LEVEL_TO_TYPE[type as string] ?? 'default'

    const props: ToastOptions = {
        type: toastType,
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

    toast(message, { ...props })
}

export default Toast
