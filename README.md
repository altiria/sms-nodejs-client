![](http://static.altiria.com/wp-content/themes/altiria/images/logo-altiria.png)

# Altiria, cliente NodeJs js

 ![](https://img.shields.io/badge/version-1.0.0-blue.svg)

Altiria SMS NodeJs es un cliente que simplifica al máximo la integración de nuestro API para NodeJs. Por el momento, esta librería abarca las funciones más básicas:
- **Envíos de SMS individuales** con las siguientes características:
  - sencillos
  - concatenados
  - certificación de entrega con o sin identificador
  - certificado digital de entrega
  - uso de remitente
  - seleccionar codificación
- **Consultas de crédito**

## Requisitos

- NodeJS: 9.4+
- NPM: 5.6.0+

## Instalación

Mediante el gestor de dependencias **npm** ejecutando el siguiente comando:

<pre>
npm install sms-altiria-client --save
</pre>


## Ejemplos de uso

### Envío de SMS

A continuación se describen cada una de las posibilidades de uso de la librería para realizar envíos de SMS.

#### Ejemplo básico

Se trata de la opción más sencilla para realizar un envío de SMS.

```js
const AltiriaClient = require('sms-altiria-client/src/altiria-client');
const AltiriaModelTextMessage = require('sms-altiria-client/src/altiria-model-text-message');
const AltiriaGwException = require('sms-altiria-client/src/exception/altiria-gw-exception.js');
const JsonException = require('sms-altiria-client/src/exception/json-exception.js');
const ConnectionException = require('sms-altiria-client/src/exception/connection-exception.js');

async function sendSms() {
	try {
	    let altiriaClient = new AltiriaClient('miusuario@email.com', 'contraseña');
	    let textMessage = new AltiriaModelTextMessage('346XXXXXXXX', 'Mensaje de prueba');
	    let data = await altiriaClient.sendSms(textMessage);
	    console.log('¡Mensaje enviado!');

	} catch (error) {
	    if(error instanceof AltiriaGwException) {
			console.log('Mensaje no aceptado: '+error.getMessage);
			console.log('Codigo de error: '+error.getStatus);
	    } else if(error instanceof JsonException) {
			console.log('Error en la petición: '+error.getMessage);
	    } else if(error instanceof ConnectionException) {
			console.log('Tiempo de espera agotado: '+error.getMessage);
	    }
	}
}

sendSms();
```

#### Ejemplo básico con timeout personalizado

Permite fijar el tiempo de respuesta en milisegundos. Si se supera se lanzará una **ConnectionException**.
Por defecto el tiempo de respuesta es de 10 segundos, pero puede ser ajustado entre 1 y 30 segundos.

```js
const AltiriaClient = require('sms-altiria-client/src/altiria-client');
const AltiriaModelTextMessage = require('sms-altiria-client/src/altiria-model-text-message');
const AltiriaGwException = require('sms-altiria-client/src/exception/altiria-gw-exception.js');
const JsonException = require('sms-altiria-client/src/exception/json-exception.js');
const ConnectionException = require('sms-altiria-client/src/exception/connection-exception.js');

async function sendSms() {
	try {
	    let altiriaClient = new AltiriaClient('miusuario@email.com', 'contraseña', 5000);
	    let textMessage = new AltiriaModelTextMessage('346XXXXXXXX', 'Mensaje de prueba');
	    let data = await altiriaClient.sendSms(textMessage);
	    console.log('¡Mensaje enviado!');

	} catch (error) {
	    if(error instanceof AltiriaGwException) {
			console.log('Mensaje no aceptado: '+error.getMessage);
			console.log('Codigo de error: '+error.getStatus);
	    } else if(error instanceof JsonException) {
			console.log('Error en la petición: '+error.getMessage);
	    } else if(error instanceof ConnectionException) {
			console.log('Tiempo de espera agotado: '+error.getMessage);
	    }
	}
}

sendSms();
```

#### Ejemplo básico con remitente

Se trata de la opción más sencilla para realizar un envío de SMS añadiendo remitente.

```js
const AltiriaClient = require('sms-altiria-client/src/altiria-client');
const AltiriaModelTextMessage = require('sms-altiria-client/src/altiria-model-text-message');
const AltiriaGwException = require('sms-altiria-client/src/exception/altiria-gw-exception.js');
const JsonException = require('sms-altiria-client/src/exception/json-exception.js');
const ConnectionException = require('sms-altiria-client/src/exception/connection-exception.js');

async function sendSms() {
	try {
	    let altiriaClient = new AltiriaClient('miusuario@email.com', 'contraseña');
	    let textMessage = new AltiriaModelTextMessage('346XXXXXXXX', 'Mensaje de prueba', 'miRemitente');
	    let data = await altiriaClient.sendSms(textMessage);
	    console.log('¡Mensaje enviado!');

	} catch (error) {
	    if(error instanceof AltiriaGwException) {
			console.log('Mensaje no aceptado: '+error.getMessage);
			console.log('Codigo de error: '+error.getStatus);
	    } else if(error instanceof JsonException) {
			console.log('Error en la petición: '+error.getMessage);
	    } else if(error instanceof ConnectionException) {
			console.log('Tiempo de espera agotado: '+error.getMessage);
	    }
	}
}

sendSms();
```
#### Ejemplo con todos los parámetros

Se muestra un ejemplo utilizando todo los parámetros e integrando el módulo **winston** para habilitar el loggin de la librería.

```js
const AltiriaClient = require('sms-altiria-client/src/altiria-client');
const AltiriaModelTextMessage = require('sms-altiria-client/src/altiria-model-text-message');
const AltiriaGwException = require('sms-altiria-client/src/exception/altiria-gw-exception.js');
const JsonException = require('sms-altiria-client/src/exception/json-exception.js');
const ConnectionException = require('sms-altiria-client/src/exception/connection-exception.js');
const winston = require('winston');

async function sendSms() {
	// Logger configuration
	const logConfiguration = {
		transports: [
			new winston.transports.File({
				filename: 'altiria-client.log',
				level: 'debug'
			})
		],
		exitOnError: false,
		format: winston.format.combine(
			winston.format.timestamp({
				format: 'DD-MMM-YYYY HH:mm:ss'
			}),
			winston.format.printf(info => `${[info.timestamp]} ${info.level} - ${info.message}`)
		)
	};
	const logger = winston.createLogger(logConfiguration);
	try {
	    logger.info('Enviando SMS...');
	    let altiriaClient = new AltiriaClient('miusuario@email.com', 'contraseña');
	    altiriaClient.setTimeout=5000;
	    let textMessage = new AltiriaModelTextMessage('346XXXXXXXX', 'Mensaje de prueba');
	    textMessage.setSenderId='miRemitente';
	    textMessage.setAck=true;
	    textMessage.setIdAck='idAck';
	    textMessage.setConcat=true;
	    textMessage.setEncoding='unicode';
	    textMessage.setCertDelivery=true;
	    let data = await altiriaClient.sendSms(textMessage);
	    console.log('¡Mensaje enviado!');

	} catch (error) {
	    if(error instanceof AltiriaGwException) {
			console.log('Mensaje no aceptado: '+error.getMessage);
			console.log('Codigo de error: '+error.getStatus);
	    } else if(error instanceof JsonException) {
			console.log('Error en la petición: '+error.getMessage);
	    } else if(error instanceof ConnectionException) {
			console.log('Tiempo de espera agotado: '+error.getMessage);
	    }
	}
}

sendSms();
```
### Consulta de crédito

A continuación se describen cada una de las posibilidades de uso de la librería para consultar el crédito.

#### Ejemplo básico

Este ejemplo no incluye los parámetros opcionales.

```js
const AltiriaClient = require('sms-altiria-client/src/altiria-client');
const AltiriaModelTextMessage = require('sms-altiria-client/src/altiria-model-text-message');
const AltiriaGwException = require('sms-altiria-client/src/exception/altiria-gw-exception.js');
const JsonException = require('sms-altiria-client/src/exception/json-exception.js');
const ConnectionException = require('sms-altiria-client/src/exception/connection-exception.js');

async function getCredit() {
	try {
	    let altiriaClient = new AltiriaClient('miusuario@email.com', 'contraseña');
	    let credit = await altiriaClient.getCredit();
	    console.log('Credito: ',credit);

	} catch (error) {
	    if(error instanceof AltiriaGwException) {
			console.log('Solicitud no aceptada: '+error.getMessage);
			console.log('Codigo de error: '+error.getStatus);
	    } else if(error instanceof JsonException) {
			console.log('Error en la petición: '+error.getMessage);
	    } else if(error instanceof ConnectionException) {
			console.log('Tiempo de espera agotado: '+error.getMessage);
	    }
	}
}

getCredit();
```

#### Ejemplo con timeout

Este ejemplo permite definir el timeout.

```js
const AltiriaClient = require('sms-altiria-client/src/altiria-client');
const AltiriaModelTextMessage = require('sms-altiria-client/src/altiria-model-text-message');
const AltiriaGwException = require('sms-altiria-client/src/exception/altiria-gw-exception.js');
const JsonException = require('sms-altiria-client/src/exception/json-exception.js');
const ConnectionException = require('sms-altiria-client/src/exception/connection-exception.js');

async function getCredit() {
	try {
		let altiriaClient = new AltiriaClient('miusuario@email.com', 'contraseña', 5000);
	    let credit = await altiriaClient.getCredit();
	    console.log('Credito: ',credit);

	} catch (error) {
	    if(error instanceof AltiriaGwException) {
			console.log('Solicitud no aceptada: '+error.getMessage);
			console.log('Codigo de error: '+error.getStatus);
	    } else if(error instanceof JsonException) {
			console.log('Error en la petición: '+error.getMessage);
	    } else if(error instanceof ConnectionException) {
			console.log('Tiempo de espera agotado: '+error.getMessage);
	    }
	}
}

getCredit();
```

## Licencia

La licencia de esta librería es de tipo MIT. Para más información consultar el fichero de licencia.

## Ayuda

Utilizamos la sección de problemas de GitHub para tratar errores y valorar nuevas funciones.
Para cualquier problema durante la intergración contactar a través del email soporte@altiria.com.
