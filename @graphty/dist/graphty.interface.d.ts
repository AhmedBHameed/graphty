export interface GQLQProducerInterface {
    fun: {
        name: string;
        args?: any;
    };
    ret?: Array<string | any>;
}
export interface GqlQueryInterface {
    query: string;
}
