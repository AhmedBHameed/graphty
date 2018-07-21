
<div style="text-align: center">
<img src="./src/images/graphty.jpg" width="400" height="300">
</div>

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
        constructor(private graphty: GraphtyService){}

        getQuery(): GqlQueryInterface{
            return this.graphty.stagnation({
                fun: {
                    name: 'getFoo',    // required field and should be always string
                    args: {name: 'foo', limit: 15}   // args is optional also it is auto detected when string inserted.
                },
                ret: ['id', 'foo_category', 'date'], // requested body can be nested by another query if with the same structure.
                combine: [this.gs.stagnation({        // To combine more that one query in one request
                    fun: {
                        name: 'getAddress'
                    },
                    ret: ['country', 'town', 'street', 'house_number']
                }]
            })
        }
        mutateQuery(): GqlQueryInterface {
            return this.graphty.mutation({
                fun: {
                    name: 'setNewFoo',    // required field and should be always string
                    args: {name: 'foo', limit: 15}   // args is optional also it is auto detected when string inserted.
                },
                ret: ['id', 'foo_category', 'date'], // requested body can be nested by another query if with the same structure.
                combine: [this.gs.mutation({        // To combine more that one query in one request
                    fun: {
                        name: 'getAddress',
                        args: {id: 12}
                    },
                    ret: ['country', 'town', 'street', 'house_number']
                }]
            })
        }
    ```

    The previous example will produce this query bellow

    ```javascript
    {   // result of getQuery() method
        query: '{setNewFoo(name:"foo",limit:15){id,foo_category,date},getAddress{country,town,street,house_number}}'
    }

    {   // result of mutateQuery() method
        query: 'mutation{setNewFoo(name:"foo",limit:15){id,foo_category,date},getAddress(id: 12){country,town,street,house_number}}'
    }
    ```
    Which you can pass them directly to the server who runs graphQL.

# Versions history:

<details>
  <summary>V0.0.4</summary>
  from now you can combine more than one query using combine property. Combining queries must be the same type either "Root queries" or "mutation queries" which sould be according to the method that called from.
  stangnation -> combine queries should be all type of mutation.
  mutation -> combine queries should be all type of mutation.
  Also few bugs fixed.
</details>
<hr>
<details>
  <summary>V0.0.3</summary>
  First module initial
</details>