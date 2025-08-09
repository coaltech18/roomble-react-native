import * as SignalR from '@microsoft/signalr';

export function createChatConnection(baseUrl: string, accessTokenFactory?: () => string) {
  const builder = new SignalR.HubConnectionBuilder();
  if (accessTokenFactory) {
    builder.withUrl(`${baseUrl}/chat`, { accessTokenFactory });
  } else {
    builder.withUrl(`${baseUrl}/chat`);
  }
  return builder.withAutomaticReconnect().build();
}


