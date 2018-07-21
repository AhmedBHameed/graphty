export interface GqlQueryInterface {
  query: string
};

export interface GQLQProducerInterface {
  fun: {
    name: string;
    args?: any
  };
  ret?: Array<string>;
  combine?: Array<GqlQueryInterface> | undefined;
}