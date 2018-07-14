var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
var GraphtyService = /** @class */ (function () {
    function GraphtyService() {
    }
    /**
     * Set the head of the query by setting name of the function and it's parameters.
     *
     * @param {string} funName
     * @param {object} args
     *
     * @returns {string}
     */
    GraphtyService.prototype.setFuntion = function (funName, args) {
        if (args === void 0) { args = null; }
        var funArguments = funName, variables = [];
        if (typeof args != 'object')
            this.throError('Invalid argument! one of the arguments must be type of object');
        if (args) {
            for (var key in args) {
                variables.push(key + ':' + (typeof (args[key]) == 'string' ? ('"' + args[key] + '"') : args[key]));
            }
            funArguments += '(' + variables.join(',') + ')';
        }
        return funArguments;
    };
    /**
     * Set the body of the query by setting required keys as responded fields. It can be another function.
     * as nested query.
     *
     * @param {Array<string | any>} funBody
     *
     * @returns {string}
     **/
    GraphtyService.prototype.setFunBody = function (funBody) {
        if (!Array.isArray(funBody))
            this.throError('body of the query should be type of array');
        var gqlBody = [];
        for (var key in funBody) {
            if (typeof (funBody[key]) == 'string') {
                gqlBody.push(funBody[key]);
            }
            else if (typeof (funBody[key]) == 'object' && funBody[key].hasOwnProperty('query')) {
                gqlBody.push(funBody[key]['query'].slice(funBody[key]['query'].indexOf("{") + 1, funBody[key]['query'].lastIndexOf("}")));
            }
            else {
                this.throError('Invalid parameter in body! the query body should be only type of string');
            }
        }
        return gqlBody.join(',');
    };
    /**
     * Set the body of the query by setting required keys as responded fields. It can be another function.
     * as nested query. The return query is type of root query and not mutation query.
     *
     * @param {Array<string | any>} funBody
     *
     * @returns {GqlQuery}
     **/
    GraphtyService.prototype.stagnation = function (graphStruct) {
        var query = '{' + this.setFuntion(graphStruct.fun.name, graphStruct.fun.args) + '{' +
            this.setFunBody(graphStruct.ret) + '}}';
        return { query: query };
    };
    /**
     * Set the body of the query by setting required keys as responded fields. It can be another function.
     * as nested query. The returned query is type of mutation query.
     *
     * @param {Array<string | any>} funBody
     *
     * @returns {GqlQuery}
     **/
    GraphtyService.prototype.mutation = function (graphStruct) {
        var query = 'mutation{' + this.setFuntion(graphStruct.fun.name, graphStruct.fun.args) + '{' +
            this.setFunBody(graphStruct.ret) + '}}';
        return { query: query };
    };
    /**
     * Pop error if exists.
     *
     * @param {string} msg
     *
     * @returns {GqlQuery}
     **/
    GraphtyService.prototype.throError = function (msg) {
        throw new Error(msg);
    };
    GraphtyService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], GraphtyService);
    return GraphtyService;
}());
export { GraphtyService };
//# sourceMappingURL=graphty.service.js.map