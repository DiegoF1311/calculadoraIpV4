import { useState } from 'react';
import IP from '../models/ip';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Ip({ ip, setIp }) {
    const [typeMask, setTypeMask] = useState(0);
    const [valueMask, setValueMask] = useState(24);
    const [valueIp, setValueIp] = useState('192.168.1.0');

    function handletValueIp(value) {
        if (IP.validarIP(value)) {
            let ipEscrito = new IP(value.split('.'), valueMask);
            setValueMask(ipEscrito.getMaskByClase());
        }
        setValueIp(value);
    }

    function handleCrearIP(e) {
        e.preventDefault();
        if (IP.validarIP(valueIp)) {
            let nuevaIp = valueIp.split('.');
            for (let i = 0; i < 4; i++) {
                nuevaIp[i] = parseInt(nuevaIp[i]);
            }
            setIp(new IP(nuevaIp, valueMask));
        } else {
            toast.error('IP inválida!', {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    function showIPBin(ip) {
        let mask = +ip.getMaskBinary();
        let submask = +ip.getSubMask() - mask;
        return ip.getIpBin().split('').map((char, i) => {
            let key = "ipBin" + i;
            if (char === '.') return <span key={key} className='text-secondary'>{char}</span>;
            else if (mask > 0) {
                mask--;
                return <span key={key} className='text-danger'>{char}</span>;
            }
            else if (submask > 0) {
                submask--;
                return <span key={key} className='text-primary'>{char}</span>;
            }
            else return <span key={key} className='text-success'>{char}</span>;
        });
    }

    function showHosts(auxValueMask) {
        return ((32-auxValueMask)*2) - 2
    }

    return (
        <div className='container bg-light shadow-lg p-5 w-50 m-4 rounded'>
            <ToastContainer
                position="top-left"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <form onSubmit={e => handleCrearIP(e)}>
                <div className='mb-4'>
                    <label htmlFor='ip' className='form-label text-primary text-center d-block fs-2'>Dirección IP</label>
                    <input type='text' id='ip' name='ip' className='form-control text-center' value={valueIp} onChange={e => handletValueIp(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="mascara" className='form-label text-primary text-center d-block fs-2'>Máscara de red</label>
                    <div className='d-flex justify-content-around m-3'>
                        <p className={`rounded-pill col m-2 border border-primary text-center cursor-pointer p-1 ${typeMask === 0 ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setTypeMask(0)}>Bits</p>
                        <p className={`rounded-pill col m-2 border border-primary text-center cursor-pointer p-1 ${typeMask === 1 ? 'bg-primary text-white' : 'text-muted'}`} onClick={() => setTypeMask(1)}>Decimal</p>
                    </div>
                    <select className="form-select mx-auto w-50 text-center" id="mascara" value={valueMask} onChange={e => setValueMask(e.target.value)}>
                        {Array.from({ length: 32 }, (_, i) => i + 1).reverse().map((i) => <option key={"ipTypeMask" + i} value={i}>{IP.mostrarTypeMask(i, typeMask)}</option>)}
                    </select>
                </div>
                <button className="btn btn-primary w-100 rounded-pill">Calcular IP</button>
            </form>
            <div className="mt-4">
                <h5 className="text-primary text-center fs-2">Información de la red</h5>
                <div className="mb-3">
                    <div className="bg-white p-3 rounded">
                        <p className="text-primary text-center">Binario</p>
                        <p className="fw-bold text-center">
                            {showIPBin(ip)}
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <p className="text-danger fw-bold">Red</p>
                            <p className="text-primary fw-bold">Subred</p>
                            <p className="text-success fw-bold">Host</p>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="bg-white p-3 rounded">
                        <p className="text-primary text-center">Máscara de subred:</p>
                        <p className="fw-bold text-center">
                            En decimal: {ip.getMask()}
                        </p>
                        <p className="fw-bold text-center">
                            En Binario: {ip.getMaskBin()}
                        </p>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="d-flex justify-content-between bg-white p-2 rounded">
                        <p className="m-2 text-primary">Tipo</p>
                        <p className="fw-bold text-center m-2">CLASE {ip.getClase()}</p>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="d-flex justify-content-between bg-white p-2 rounded">
                        <p className="m-2 text-primary">Clasificacion</p>
                        <p className="fw-bold text-center m-2">{ip.getClasificacion()}</p>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="d-flex justify-content-between bg-white p-2 rounded">
                        <p className="text-primary m-2">Red</p>
                        <p className="fw-bold text-center m-2">{ip.getRed()}/{ip.getMaskBinary()}</p>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="d-flex justify-content-between bg-white p-2 rounded">
                        <p className="text-primary m-2">Cantidad de Hosts</p>
                        <p className="fw-bold text-center m-2">{showHosts(ip.getMaskBinary())}</p>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="d-flex justify-content-between bg-white p-2 rounded">
                        <p className="text-primary m-2">Rango de IP utiles</p>
                        <p className="fw-bold text-center m-2">{ip.getRangoHosts()}</p>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="d-flex justify-content-between bg-white p-2 rounded">
                        <p className="text-primary m-2">Broadcast</p>
                        <p className="fw-bold text-center m-2">{ip.getBroadcast()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
