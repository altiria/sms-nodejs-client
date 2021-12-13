![](http://static.altiria.com/wp-content/themes/altiria/images/logo-altiria.png)


# Altiria, cliente SMS NodeJS

Para poder utilizar nuestro servicio es necesario previamente crear una cuenta en Altiria. Es habitual crear una **cuenta de prueba** en la que cargamos una serie de créditos de manera gratuita para que puedas realizar pruebas durante la integración.

Cabe mencionar que este proyecto consta de una **sección de tests** que al ser lanzados pueden suponer un **consumo de créditos**. En concreto, son los test "SendSmsHttpTest.testOkMandatoryParams" y "SendSmsHttpTest.testOkAllParams" que al ser lanzados consumirán un mínimo de tres créditos. Este consumo puede verse incrementado si se habilita la característica "certDelivery" comentada en el test "SendSmsHttpTest.testOkAllParams", para certificar la entrega del SMS.

Antes de lanzar los tests es necesario **parametrizar cada suite** modificando las variables definidas bajo el comentario "configurable parameters".
Los parámetros a configurar son los siguientes:
- login: email de la cuenta.
- password: contraseña de la cuenta.
- destination: teléfono destino. Es importante agregar el prefijo internacional y no incluir ningún símbolo ni espacio. Ejemplo: '346XXXXXXXX'.
- sender: (opcional) remitente. Sólo se debe asignar un valor para el remitente si ha sido previamente autorizado por Altiria. En caso contrario asignar undefined como valor.

Finalmente, para correr todos los tests ejecutar el comando **npm run test** desde el directorio raíz del proyecto.
Si se quiere correr una suite en particular, es necesario parametrizar previamente la tarea **isolated_suite_test** del fichero package.json con el nombre de la suite que se quiere lanzar. A continuación, ejecutar el comando **npm run isolated_suite_test** desde el directorio raíz del proyecto.
Si se quiere correr un test en particular, es necesario parametrizar previamente la tarea **isolated_test** del fichero package.json con el nombre de la suite y el test que se quiere lanzar. A continuación, ejecutar el comando **npm run isolated_test** desde el directorio raíz del proyecto.



