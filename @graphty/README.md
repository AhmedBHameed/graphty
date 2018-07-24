
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
    - `root query` -> `stagnation(object: )` method.
    - `mutation query` -> `mutation(object)` method.
    - `combine queries` -> `combine(Array<objects>)` method V0.0.5.
- Inject `GraphtyService` inside you component class and feel free forming your graphql queries.
    ```typescript
    import { GraphtyService } from 'graphty';
        ...
        constructor(private graphty: GraphtyService){}

        getQuery(): GqlQueryInterface {
            return this.graphty.stagnation({
                fun: {
                    name: 'getFoo',    // required field and should be always string
                    args: {name: 'foo', limit: 15}   // args is optional also it is auto detected when string inserted.
                },
                ret: ['id', 'foo_category', 'date'], // requested body can be nested by another query if with the same structure.
                combine: [this.gs.stagnation({        // To combine more that one query in one request (in 0.0.5 deprecated)
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
                combine: [this.gs.mutation({        // To combine more that one query in one request (in 0.0.5 deprecated)
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

    In version `0.0.5` property `combine` is seperated to reduce confusion which make it easier to form combined queries of graphQL. This method will reduce channel traffic between clients and server by combining two or more quries in one request. This should be with the respect of qurey type, since mutation should be send with `POST` and normal root query should send with `GET` they must not be mixed which is more reasonable. Mixing will throw error with a nice message ;)

    ```javascript
        let GQLQ: GqlQueryInterface = this.gs.combine([
                        this.gs.stagnation({
                            fun: {
                            name: 'getUser',
                            args: { username: 'foo' }
                            },
                            ret: ['bar', this.gs.stagnation({   /** You can do nested object also as respond */
                                fun: {
                                    name: 'ack'
                                },
                                ret: ['ok', 'message']
                            })
                            ]
                        }),
                        this.gs.stagnation({
                            fun: {
                                name: 'getCategory',
                                args: {name: 'foo', limit: 15}
                            },
                            ret: ['id', 'work', 'skills']
                        })
                    ]);
        console.log(GQLQ); // Resault -> {query:`{getUser(username:"foo"){bar,ack{ok,message}},getCategory(name:"foo",limit:15){id,work,skills}}`}
    ```

# Versions history:

<details>
  <summary>V0.0.5</summary>
  - Combine method seperated from stangnation, mutation methods.
  - also fix some bugs.
</details>
<hr>
<details>
  <summary>V0.0.4</summary>
  - from now you can combine more than one query using combine property. Combining queries must be the same type either "Root queries" or "mutation queries" which sould be according to the method that called from.
  stangnation -> combine queries should be all type of mutation.
  mutation -> combine queries should be all type of mutation.
  - Also few bugs fixed.
</details>
<hr>
<details>
  <summary>V0.0.3</summary>
  - First module initialize
</details>