import {
  IdentityProvider,
  MockIdentityProvider,
  SumsubProvider
} from "./identity";

export function createIdentityProvider(): IdentityProvider {

  switch (process.env.IDENTITY_PROVIDER) {

    case "sumsub":
      return new SumsubProvider();

    case "mock":
    default:
      return new MockIdentityProvider();

  }

}