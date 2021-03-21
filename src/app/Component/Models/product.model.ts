
export interface  productModelServer{
    // id : number;
    // name : string;
    // category : string;
    description : string;
    imagePath : string;
    price :  number;
    title: string;
    // quantity : number;
    // images :  string;
}

export interface serverResponse{
    count : number;
    products :  productModelServer[];
}
