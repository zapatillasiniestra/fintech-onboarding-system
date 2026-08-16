import {
  IdentityProvider,
  MockIdentityProvider,
  SumsubProvider
} from "./identity";

import {
  AIProvider,
  MockAIProvider
} from "./ai";

export function createIdentityProvider(): IdentityProvider {
  switch (process.env.IDENTITY_PROVIDER) {

    case "mock":
    default:
      return new MockIdentityProvider();

    case "sumsub":
      return new SumsubProvider();

  }

}

export function createAIProvider(): AIProvider {
  switch (process.env.AI_PROVIDER) {

    case "mock":
    default:
      return new MockAIProvider();

  }

}