import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
//Components
import Ip from './components/Ip'
import IP from './models/ip'


function App() {
  const [ip, setIp] = useState(new IP())

  return (
    <>
      <div className='h-100 d-flex flex-column p-5 bg-primary'>
        <div className='h-25 d-flex flex-column justify-content-center my-4 my-md-0'>
          <h1 className='text-center fw-bold display-4 display-sm-1 display-md-2 display-lg-3 text-light'>
            Calculadora IP
          </h1>
        </div>
        <div className="d-flex flex-column align-items-center">
          <Ip ip={ip} setIp={setIp} />
        </div>
        <div className='h-25 d-flex flex-column justify-content-center my-4 my-md-0'>
          <p className='text-center fw-bold fs-4 text-light'>
            Diego Alejandro Forero Espitia
          </p>
        </div>
      </div>
    </>
  )
}

export default App
