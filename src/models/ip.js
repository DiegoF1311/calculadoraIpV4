export default class IP {
    constructor(ip = [192,168,1,0], mask = 24) {
        this.ip = ip
        let mascara = [0, 0, 0, 0]
        for(let j = 0; j < mask; j++) {
            let octeto = Math.floor(j / 8)
            mascara[octeto] = mascara[octeto] + 2 ** (7 - j % 8)
        }
        this.mask = mascara
        this.maskBinary = mask
        this.submask = mask
    }

    getIp() {
        return this.ip
    }

    setIp(ip) {
        this.ip = ip
    }

    setSubMask(submask) {
        this.submask = submask
    }

    getSubMask() {
        return this.submask
    }

    getMask() {
        return this.mask[0] + "." + this.mask[1] + "." + this.mask[2] + "." + this.mask[3]
    }

    getMaskBinary() {
        return this.maskBinary
    }

    getMaskBin() {
        return this.mask[0].toString(2) + "." + this.mask[1].toString(2) + "." + this.mask[2].toString(2) + "." + this.mask[3].toString(2)
    }

    setMask(mask) {
        this.mask = mask
    }

    getClase() {
        if(this.ip[0] >= 0 && this.ip[0] <= 127) {
            return 'A'
        } else if(this.ip[0] >= 128 && this.ip[0] <= 191) {
            return 'B'
        } else if(this.ip[0] >= 192 && this.ip[0] <= 223) {
            return 'C'
        } else if(this.ip[0] >= 224 && this.ip[0] <= 239) {
            return 'D'
        } else if(this.ip[0] >= 240 && this.ip[0] <= 255) {
            return 'E'
        }
    }

    getClasificacion() {
        if(this.ip[0] === 10) {
            return 'No homologada (Privada)'
        } else if (this.ip[0] === 172 && (this.ip[1] >= 16 | this.ip[1] <= 31)) {
            return 'No homologada (Privada)'
        } else if (this.ip[0] === 192 && this.ip[1] === 168) {
            return 'No homologada (Privada)'
        } else {
            return 'Homologada (Publica)'
        }
    }

    getMaskByClase() { 
        if(this.ip[0] >= 0 && this.ip[0] <= 127) {
            return 8
        } else if(this.ip[0] >= 128 && this.ip[0] <= 191) {
            return 16
        } else if(this.ip[0] >= 192 && this.ip[0] <= 223) {
            return 24
        } else return 24
    }


    getRed() { 
        let red = []
        for(let i = 0; i < 4; i++) {
            red.push(this.ip[i] & this.mask[i])
        }
        return red.join('.')
    }

    getRedArray() {
        return this.getRed().split('.').map(octet => parseInt(octet))
    }

    getBroadcast() {
        const ipBin = this.ip.map(octet => {
            return ('00000000' + octet.toString(2)).slice(-8);
        }).join('');
        const maskBin = this.mask.map(octet => {
            return ('00000000' + octet.toString(2)).slice(-8);
        }).join('');
        const broadcastBin = ipBin.split('').map((bit, i) => {
            return maskBin[i] === '1' ? bit : '1';
        }).join('');
        return broadcastBin.match(/.{8}/g).map(byte => {
            return parseInt(byte, 2);
        }).join('.');
    }

    getRangoHosts() {
        if(this.mask[3] === 255 | this.mask[3] === 254) {
            return "NO HAY HOSTS DISPONIBLES"
        }
        const red = this.getRed();
        const broadcast = this.getBroadcast();

        let inicio = +red.split('.')[3] + 1
        let terminacion = +broadcast.split('.')[3] - 1

        let primerHost = red.split('.').slice(0, 3).join('.') + '.' + inicio
        let ultimoHost = broadcast.split('.').slice(0, 3).join('.') + '.' + terminacion

        return `${primerHost} - ${ultimoHost}`
    }

    getIpHex() {
        return this.ip.map(octeto => octeto.toString(16)).join('.')
    }

    getIpBin() {
        return this.ip.map(octeto => {
            return ('00000000' + octeto.toString(2)).slice(-8);
        }).join('.');
    }

    //Utilidades
    static mostrarTypeMask = (bitsRed, typeMask) => {
        if(typeMask === 0) {
            return bitsRed
        } else if(typeMask === 1) {
            let octetos = [0, 0, 0, 0]
            for(let j = 0; j < bitsRed; j++) {
                let octeto = Math.floor(j / 8)
                octetos[octeto] = octetos[octeto] + 2 ** (7 - j % 8)
            }
            return octetos.join('.')
        } else {
            let octetos = [0, 0, 0, 0]
            for(let j = 0; j < bitsRed; j++) {
                let octeto = Math.floor(j / 8)
                octetos[octeto] = octetos[octeto] + 2 ** (7 - j % 8)
            }
            return octetos.map(octeto => octeto.toString(16)).join('.')
        }
    }

    static validarIP(ip) { 
        let ipArray = ip.split('.')
        for(let i = 0; i < 4; i++) {
            console.log()
            if(ipArray[i] < 0 || ipArray[i] > 255 || ipArray[i] === '') {
                return false
            }
        }
        return /^[0-9]+$/.test(ipArray.join('')) && ipArray.length === 4;
    }
}