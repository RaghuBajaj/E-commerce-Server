class ApiResponse {
    constructor( statusCode, data = [], message = "Successfull!"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export {ApiResponse};