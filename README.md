
![Graphty](./src/images/graphty.jpg)

# Graphty

Angular 2+ Module to make it easer forming GraphQL queries.

# Installation

- Install module using:
    ```text
    $ npm i graphty --save
    ```
- Import module to your *.module.ts
    ```typescript
    ...
    import { GraphtyModule, GqlQueryInterface } from 'graphty';

    @NgModule({
    ...
    imports: [
        ...
        GraphtyModule,
        ...
    ],
    ...
    })
    export class AppModule { }

    ```
- Two important methods for forming queries according to the type (Root query or mutation query).
    - `root query` -> `stagnation(object)` method.
    - `mutation query` -> `mutation(object)` method.
- Inject `GraphtyService` inside you component class and feel free forming your graphql queries.
    ```typescript
    import { GraphtyService } from 'graphty';
        ...
        constructor(private graphty: GraphryService){}

        getQuery(): GqlQueryInterface{
            return this.graphty.stagnation({
                fun: {
                    name: 'getFoo',    // required field and should be always string
                    args: {name: 'foo', limit: 15}   // args is optional also it is auto detected when string inserted.
                },
                ret: ['id', 'foo_category', 'date'] // requested body can be nested by another query if with the same structure.
            })
        }
        mutateQuery(): GqlQueryInterface {
            return this.graphty.mutation({
                fun: {
                    name: 'setNewFoo',    // required field and should be always string
                    args: {name: 'foo', limit: 15}   // args is optional also it is auto detected when string inserted.
                },
                ret: ['id', 'foo_category', 'date'] // requested body can be nested by another query if with the same structure.
            })
        }
    ```

    The previous example will produce this query bellow

    ```javascript
    {   // result of getQuery() method
        query: '{setNewFoo(name:"foo",limit:15){id,foo_category,date}}'
    }

    {   // result of mutateQuery() method
        query: 'mutation{setNewFoo(name:"foo",limit:15){id,foo_category,date}}'
    }
    ```
    Which you can pass them directly to the server who runs graphQL.
