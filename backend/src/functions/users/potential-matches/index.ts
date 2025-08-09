import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function potentialMatchesHandler(
  _req: HttpRequest,
  _ctx: InvocationContext
): Promise<HttpResponseInit> {
  // TODO: Pull from Cosmos DB and score matches
  const mock = [
    { id: '1', name: 'Aarav', age: 24, area: 'Koramangala' },
    { id: '2', name: 'Diya', age: 26, area: 'HSR Layout' }
  ];
  return { status: 200, jsonBody: mock };
}

app.http('potential-matches', {
  methods: ['GET'],
  route: 'users/potential-matches',
  authLevel: 'anonymous',
  handler: potentialMatchesHandler
});


