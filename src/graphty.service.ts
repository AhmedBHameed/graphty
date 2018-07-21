import { Injectable } from '@angular/core';
import { GqlQueryInterface, GQLQProducerInterface } from './graphty.interface';

@Injectable()
export class GraphtyService {

  constructor() { }

  /**
   * Set the head of the query by setting name of the function and it's parameters.
   * 
   * @param {string} funName
   * @param {object} args 
   * 
   * @returns {string}
   */
  public setFuntion(funName: string, args: any = null): string {
    let funArguments = funName, variables: Array<string> = [];
    if (typeof args != 'object') this.throError('Invalid argument! one of the arguments must be type of object');
    if (args) {
      for (let key in args) {
        variables.push(key + ':' +(typeof(args[key]) == 'string' ? ('"' + args[key] + '"') : args[key]));
      }
      funArguments += '(' + variables.join(',') + ')';
    }
    return funArguments;
  }

  /**
   * Set the body of the query by setting required keys as responded fields. It can be another function.
   * as nested query.
   * 
   * @param {Array<string>} funBody
   * 
   * @returns {string}
   **/
  public setFunBody(funBody: Array<string>): string {
    if (!Array.isArray(funBody)) this.throError('body of the query should be type of array');
    let gqlBody: Array<string> = [];
    for(let key in funBody) {
      if(typeof(funBody[key]) == 'string') {
        gqlBody.push(funBody[key]);
      } else {
        this.throError('Invalid parameter in body! the query body should be only type of string');
      }
    }
    return gqlBody.join(',');
  }

  /**
   * Set the body of the query by setting required keys as responded fields. It can be another function.
   * as nested query.
   * 
   * @param {Array<string>} funBody
   * 
   * @returns {string}
   **/
  public combineQuery(combineQuery: Array<GqlQueryInterface> = [], typeOfQuery: string | null = null): string {
    let numOfMutations: number = 0, numOfQueries: number = 0, len: number = combineQuery.length
    for(let i=0; i<len; i++) {
        combineQuery[i].query.indexOf('mutation') > -1 ? numOfMutations++ : numOfQueries++;
    }
    if(typeOfQuery) {
      if(len !=  numOfMutations) this.throError('Invalid type of combined queries! Queries should have the same type as "mutation" since it is called from "mutation" method.');
    } else {
      if(len !=  numOfQueries) this.throError('Invalid type of combined queries! Queries should have the same type as "root query" since it is called from "stagnation" method.');
    }
    return ',' + combineQuery.map(
      q=>q.query.slice(q.query.indexOf("{")+1, q.query.lastIndexOf("}"))
    ).join(',');
  }

  /**
   * Set the body of the query by setting required keys as responded fields. It can be another function.
   * as nested query. The return query is type of root query and not mutation query.
   * 
   * @param {Array<string>} funBody
   * 
   * @returns {GqlQuery}
   **/
  public stagnation(graphStruct: GQLQProducerInterface): GqlQueryInterface {
    let query = '{' +
      this.setFuntion(graphStruct.fun.name, graphStruct.fun.args) + '{' + 
      this.setFunBody(graphStruct.ret as Array<string>) + '}' +
      (graphStruct.combine ? 
        this.combineQuery(graphStruct.combine as Array<GqlQueryInterface>) : '') + 
    '}';
    return {query};
  }

  /**
   * Set the body of the query by setting required keys as responded fields. It can be another function.
   * as nested query. The returned query is type of mutation query.
   * 
   * @param {Array<string | any>} funBody
   * 
   * @returns {GqlQuery}
   **/
  public mutation(graphStruct: GQLQProducerInterface): GqlQueryInterface {
    let query = 'mutation{' +
      this.setFuntion(graphStruct.fun.name, graphStruct.fun.args) + '{' + 
      this.setFunBody(graphStruct.ret as Array<string>) + '}' + 
      (graphStruct.combine ? 
        this.combineQuery(graphStruct.combine as Array<GqlQueryInterface>) : '') +
      '}';
    return {query};
  }

  /**
   * Pop error if exists.
   * 
   * @param {string} msg
   * 
   * @returns {GqlQuery}
   **/
  public throError(msg: string) {
    throw new Error(msg);
  }

}