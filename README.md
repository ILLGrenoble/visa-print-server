# VISA Print Server

The VISA Print Server is used to transfer PDF documents via websocket to a VISA Print Client which opens a print dialog on the host computer of the VISA user.

The transfer is triggered by a request from the [VISA CUPS Driver](https://ILLGrenoble/visa-cups) when a user prints a document in an instance. It clients are available it will send chunked data to all that have printing enabled.

The [VISA Print Client](https://ILLGrenoble/visa-print-client), an angular module integrated into the [VISA front end](https://ILLGrenoble/visa-web), receives the PDF data and informs the user/opens a print dialog.

An [authentication proxy](https://ILLGrenoble/visa-jupyter-proxy) is used to ensure that only the owner of an instance can connect to the VISA Print Server and receive print requests.

The user then selects a local printer to print the document or saves the PDF as a local file.

# Building and running

The server can be built and run from source as follows:

```
npm install
npm start
```

You can also run it directly from the npm pacakge:

```
npm i -g @illgrenoble/visa-print-server
visa-print-server
```

# Configuration

The following environment variables can be set to configure the VISA Print Server:

|Environment variable|default value|description|
|---|---|---|
|VISA_PRINT_SERVER_HOST|localhost|Host on which the web server listens to|
|VISA_PRINT_SERVER_PORT|8091|The web server port|
|VISA_PRINT_SERVER_AUTH_TOKEN| |An authorisation token that (when set) must be added to the request header `x-auth-token`|
|VISA_PRINT_SERVER_WEBSOCKET_MAX_DATA|16384|Maximum chunk size that is sent via the websocket|

The environment variables can be stored in a `.env` file.
