# VISA Print Server

[![npm version](https://badge.fury.io/js/%40illgrenoble%2Fvisa-print-server.svg)](https://badge.fury.io/js/%40illgrenoble%2Fvisa-print-server)

The VISA Print Server is used to transfer PDF documents via websocket to a VISA Print Client which opens a print dialog on the host computer of the VISA user.

The transfer is triggered by a request from the [VISA CUPS Driver](https://github.com/ILLGrenoble/visa-cups) when a user prints a document in an instance. It clients are available it will send chunked data to all that have printing enabled.

The [VISA Print Client](https://github.com/ILLGrenoble/visa-print-client), an angular module integrated into the [VISA front end](https://github.com/ILLGrenoble/visa-web), receives the PDF data and informs the user/opens a print dialog.

An [authentication proxy](https://github.com/ILLGrenoble/visa-jupyter-proxy) is used to ensure that only the owner of an instance can connect to the VISA Print Server and receive print requests.

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


## Demo

A demo is available to quickly test the connection between a client and a server, the transfer of a PDF file via websocket and the opening of the print dialog in the client.

To start the server locally run the following commands in a terminal:

```
npm i -g @illgrenoble/visa-print-server
visa-print-server
```

This will start up the VISA Print Server on localhost:8091 without authentication enabled.

In another terminal, use the following commands to build and run the client:

```
git clone https://github.com/ILLGrenoble/visa-print-client.git
cd visa-print-client
npm install
npm run build:lib
npm start
```

The client will automatically connect to the websocket server on localhost and enable the printing queue. Open a browser window at http://localhost:4200 (you should only see a grey window). In a debug console you should see that the websocket is connected and printing enabled. 

To test the transfer of a PDF file, from another terminal perform the following command:

```
curl -X POST http://localhost:8091/api/printer --data-urlencode "path=<path_to_a_pdf>" --data-urlencode "jobId=1"
```

Change `path_to_a_pdf` to the absolute path of a PDF file on your computer. The print dialog should open on the client app with the PDF available for printing.
