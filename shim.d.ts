declare var utils: {
  request: <T>(options: { method: string, url: string }, callback: (error: any, response: Response, body: string) => void) => T
}

declare var reject: (msg: string) => never
declare var resolve: (msg: string) => never
