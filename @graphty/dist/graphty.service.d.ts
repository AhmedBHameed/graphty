import { GqlQueryInterface, GQLQProducerInterface } from './graphty.interface';
export declare class GraphtyService {
    constructor();
    /**
     * Set the head of the query by setting name of the function and it's parameters.
     *
     * @param {string} funName
     * @param {object} args
     *
     * @returns {string}
     */
    setFuntion(funName: string, args?: any): string;
    /**
     * Set the body of the query by setting required keys as responded fields. It can be another function.
     * as nested query.
     *
     * @param {Array<string | any>} funBody
     *
     * @returns {string}
     **/
    setFunBody(funBody: Array<string | any>): string;
    /**
     * Set the body of the query by setting required keys as responded fields. It can be another function.
     * as nested query. The return query is type of root query and not mutation query.
     *
     * @param {Array<string | any>} funBody
     *
     * @returns {GqlQuery}
     **/
    stagnation(graphStruct: GQLQProducerInterface): GqlQueryInterface;
    /**
     * Set the body of the query by setting required keys as responded fields. It can be another function.
     * as nested query. The returned query is type of mutation query.
     *
     * @param {Array<string | any>} funBody
     *
     * @returns {GqlQuery}
     **/
    mutation(graphStruct: GQLQProducerInterface): GqlQueryInterface;
    /**
     * Pop error if exists.
     *
     * @param {string} msg
     *
     * @returns {GqlQuery}
     **/
    throError(msg: string): void;
}
