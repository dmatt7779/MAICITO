import { useEffect, useRef } from 'react'
import { useRooms } from '../pages/Dashboard'
import '../styles/loader.css'

const Loader = () => {
    const { visibleLoader } = useRooms();

    const refDialog = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (visibleLoader) {
            refDialog.current?.showModal()
        } else {
            refDialog.current?.close()
        }
    }, [visibleLoader])

    return (
        <dialog className='dld-dialog'
            ref={refDialog}
        >
            <div className='dld-content'>
                <div className='dld-animate'>
                    <div className='dld-a-gif'></div>
                </div>
                <label className='dld-text'>Procesando solicitud...</label>
            </div>
        </dialog>
    )
}

export default Loader