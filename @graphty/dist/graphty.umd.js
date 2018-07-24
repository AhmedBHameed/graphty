(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
    (factory((global.ng = global.ng || {}, global.ng['@graphty'] = {}),global.ng.core));
}(this, (function (exports,core) { 'use strict';

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (undefined && undefined.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
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
         * @param {Array<string>} funBody
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
         * as nested query.
         *
         * @param {Array<string>} funBody
         *
         * @returns {string}
         **/
        GraphtyService.prototype.combineQuery = function (combineQuery, typeOfQuery) {
            if (combineQuery === void 0) { combineQuery = []; }
            if (typeOfQuery === void 0) { typeOfQuery = null; }
            var numOfMutations = 0, numOfQueries = 0, len = combineQuery.length;
            for (var i = 0; i < len; i++) {
                combineQuery[i].query.indexOf('mutation') > -1 ? numOfMutations++ : numOfQueries++;
            }
            if (len != numOfQueries && len != numOfMutations)
                this.throError('Invalid type of combined queries! All combined queries should call from the same method. Either "stangnation" or "mutation".');
            return [combineQuery.map(function (q) { return q.query.slice(q.query.indexOf("{") + 1, q.query.lastIndexOf("}")); }).join(','), numOfQueries > numOfMutations ? '' : 'mutation'];
        };
        /**
         * Set the body of the query by setting required keys as responded fields. It can be another function.
         * as nested query. The return query is type of root query and not mutation query.
         *
         * @param {Array<string>} funBody
         *
         * @returns {GqlQuery}
         **/
        GraphtyService.prototype.stagnation = function (graphStruct) {
            var query = '{' +
                this.setFuntion(graphStruct.fun.name, graphStruct.fun.args) + '{' +
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
            var query = 'mutation{' +
                this.setFuntion(graphStruct.fun.name, graphStruct.fun.args) + '{' +
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
        GraphtyService.prototype.combine = function (ArrGraphStruct) {
            var query = '', cqr = [];
            if (typeof (ArrGraphStruct) == 'object' && Array.isArray(ArrGraphStruct)) {
                cqr = this.combineQuery(ArrGraphStruct);
            }
            query = cqr[1] + '{' + cqr[0] + '}';
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
            core.Injectable(),
            __metadata("design:paramtypes", [])
        ], GraphtyService);
        return GraphtyService;
    }());

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var GraphtyModule = /** @class */ (function () {
        function GraphtyModule() {
        }
        GraphtyModule = __decorate$1([
            core.NgModule({
                providers: [GraphtyService]
            })
        ], GraphtyModule);
        return GraphtyModule;
    }());

    exports.GraphtyModule = GraphtyModule;
    exports.GraphtyService = GraphtyService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=graphty.umd.js.map
