class ApiErrors extends Error{
    private status:string;
    constructor(msg:string, private statusCode:number){
        super(msg);
        this.status = `${this.statusCode}`.startsWith('4') ? "Client Failure" : "Server Error";
    };
}

export default ApiErrors;