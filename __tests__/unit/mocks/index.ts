export class Logger {
  timespan<T>(name: string, operation: () => T): T {
    return operation();
  }
  context(name: string, data: { [key: string]: any; } | null) {}
  click(message: string, data?: any) {}
  response(response: Response) {}
  info(message: string, data?: any, forceLogToConsole?: boolean) {}
  warn(message: string, data?: any) {}
  error(message: string, error: any, level?: string, forceLogToConsole?: boolean) {}
}

export const log = new Logger();